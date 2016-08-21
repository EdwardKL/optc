import Express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import path from 'path';

// Webpack Requirements
import webpack from 'webpack';
import config from '../webpack.config.dev';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

// Initialize the Express App
const app = new Express();

if (process.env.NODE_ENV !== 'production') {
  const compiler = webpack(config);
  app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }));
  app.use(webpackHotMiddleware(compiler));
}

// React And Redux Setup
import { configureStore } from '../shared/redux/store/configureStore';
import { Provider } from 'react-redux';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { match, RouterContext } from 'react-router';

// Import required modules
import routes from '../shared/routes';
import { fetchComponentData, getGlobbedFiles } from './util/server_utils';
import serverConfig from './config';

// MongoDB Connection
mongoose.connect(serverConfig.mongoURL, (error) => {
  if (error) {
    /* istanbul ignore next */
    console.error('Please make sure Mongodb is installed and running!'); // eslint-disable-line no-console
    throw error;
  }
});

require('./models/captain');
require('./models/captain_ability');
require('./models/special');
require('./models/unit');
import User from './models/user';

// Apply body Parser and server public assets and routes
app.use(bodyParser.json({ limit: '20mb' }));
app.use(bodyParser.urlencoded({ limit: '20mb', extended: false }));
app.use(Express.static(path.resolve(__dirname, '../static')));

var flash = require('connect-flash');
app.use(flash());

// passport stuff
var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('passport');

passport.serializeUser(function (user, done) {
  done(null, user._id);
});

passport.deserializeUser(function (id, done) {
  /* istanbul ignore next */
  User.findById(id).exec(done);
});

app.use(cookieParser());
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());

// Initialize strategies
getGlobbedFiles('./server/strategies/*.js').forEach((strategy) => {
  require(path.resolve(strategy))();
});

// Initialize routes
// NOTE: This has to be done after model require statements.
getGlobbedFiles('./server/routes/*.routes.js').forEach((route) => {
  require(path.resolve(route))(app);
});

import Header from '../shared/components/Header/Header';
// Render Initial HTML
/* istanbul ignore next */
const renderFullPage = (body_html, initialState) => {
  const cssHeaderPath = process.env.NODE_ENV === 'production' ? '/css/header.min.css' : '/css/header.css';
  const cssMainPath = process.env.NODE_ENV === 'production' ? '/css/main.min.css' : '/css/main.css';
  return `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Ohara</title>
        <link rel="stylesheet" href=${cssHeaderPath} />
        <link rel="stylesheet" href=${cssMainPath} />
        <link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css">
        <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-social/4.12.0/bootstrap-social.min.css">
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/latest/css/bootstrap.min.css" />
        <link href='https://fonts.googleapis.com/css?family=Lato:400,300,700' rel='stylesheet' type='text/css'/>
        <link rel="shortcut icon" href="/img/robin_run.png" type="image/png" />
        <script>
          (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
          (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
          m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
          })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

          ga('create', 'UA-82810287-1', 'auto');
          ga('send', 'pageview');

        </script>
      </head>
      <body id="body">
        <div id="root">${body_html}</div>
        <script>
          window.__INITIAL_STATE__ = ${JSON.stringify(initialState)};
        </script>
        <script src="/dist/bundle.js"></script>
      </body>
    </html>
  `;
};

const protected_paths = ['/account'];

import unit_selections from '../data/unit_selections.json';
import socket_selections from '../data/socket_selections.json';
// Server Side Rendering based on routes matched by React-router.
/* istanbul ignore next server is hard to test */
app.use((req, res) => {
  match({ routes, location: req.url }, (err, redirectLocation, renderProps) => {
    if (err) {
      return res.status(500).end('Internal server error');
    }

    if (!renderProps) {
      return res.status(404).end('Not found!');
    }

    if (req.url === '/auth/oauth-signup') {
      // If not logged in OR has a username, redirect outta here.
      if (!req.user || (req.user.username && req.user.username.length > 0)) {
        return res.redirect('/');
      }
    }

    if (protected_paths.indexOf(req.url) !== -1) {
      console.log('Accessing protected path. Checking authentication status...');
      if (!req.isAuthenticated()) {
        // TODO: Maybe redirect to login instead?
        req.flash('error_message', 'Please sign in.');
        return res.redirect('/signup');
      }

      // This is an OAuth user with no username set yet. Redirect to get a username.
      if (req.user && (!req.user.username || req.user.username.length === 0)) {
        req.flash('info_message', 'You need a username to proceed.');
        return res.redirect('/auth/oauth-signup');
      }
    }

    var user = req.user;
    var initialState = { identity: { unit_selections, socket_selections } };
    if (typeof user !== 'undefined') {
        // Clear out sensitive data first.
      user.clearSensitiveData();
    }
    initialState.identity.user = user;
    const info_message = req.flash('info_message')[0];
    const error_message = req.flash('error_message')[0];
    if (info_message) {
      initialState.identity.info_message = info_message;
    }
    if (error_message) {
      initialState.identity.error_message = error_message;
    }
    const store = configureStore(initialState);
    fetchComponentData(store.dispatch, renderProps.components, renderProps.params, req.user ? req.user._id : null)
      .then(() => {
        const initialView = renderToString(
          <Provider store={store}>
            <div>
              <Header />
              <RouterContext {...renderProps} />
            </div>
          </Provider>
        );

        const finalState = store.getState();

        res.status(200).end(renderFullPage(initialView, finalState));
      })
      .catch((err) => {
        console.log('Error in server side rendering: ', err);
        res.end(renderFullPage('Error', {}));
      });
  });
});

// start app
app.listen(process.env.PORT || serverConfig.port, (error) => {
  if (!error) {
    console.log(`OPTC Ohara is running on port: ${serverConfig.port}!`); // eslint-disable-line
  }
});

export default app;
