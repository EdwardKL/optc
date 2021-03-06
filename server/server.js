import Express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import path from 'path';

// React And Redux Setup
import { Provider } from 'react-redux';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { match, RouterContext } from 'react-router';
import { configureStore } from '../shared/redux/store/configureStore';

// Models
import './models/captain';
import './models/captain_ability';
import './models/special';
import './models/unit';
import User from './models/user';

import { SE_PARAM } from '../constants/common';

// Import required modules
import routes from '../shared/routes';
import { fetchComponentData, getGlobbedFiles } from './util/server_utils';
import serverConfig from './config';

import flash from 'connect-flash';

// passport stuff
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';

import Header from '../shared/components/Header/Header';
import Footer from '../shared/components/Footer/Footer';
import unit_selections from '../data/unit_selections.json';
import socket_selections from '../data/socket_selections.json';

const MongoStore = require('connect-mongo')(session);

// Initialize the Express App
const app = new Express();
console.log('App initialized.');
let production = true;
if (process.env.NODE_ENV !== 'production') {
  // Webpack Requirements
  const webpack = require('webpack'); // eslint-disable-line global-require
  const webpackDevMiddleware = require('webpack-dev-middleware'); // eslint-disable-line global-require
  const webpackHotMiddleware = require('webpack-hot-middleware'); // eslint-disable-line global-require
  const config = require('../webpack.config.dev'); // eslint-disable-line global-require

  console.log('Not running production, disabling ads. Environment: ', process.env.NODE_ENV);
  production = false;
  const compiler = webpack(config);
  app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }));
  app.use(webpackHotMiddleware(compiler));
}

// MongoDB Connection
mongoose.connect(serverConfig.mongoURL, (error) => {
  if (error) {
    /* istanbul ignore next */
    console.error('Please make sure Mongodb is installed and running!'); // eslint-disable-line no-console
    throw error;
  }
});

// Apply body Parser and server public assets and routes
app.use(bodyParser.json({ limit: '20mb' }));
app.use(bodyParser.urlencoded({ limit: '20mb', extended: false }));
app.use(Express.static(path.resolve(__dirname, '../static')));
app.use(flash());

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  /* istanbul ignore next */
  User.findById(id).exec(done);
});

app.use(cookieParser());
app.use(session({
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  secret: process.env.COOKIE_SECRET,
  resave: false,
  saveUninitialized: false,
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

// Render Initial HTML
/* istanbul ignore next */
const renderFullPage = (body_html, initialState) => {
  const css = production ? '<link rel="stylesheet" href="/css/app.min.css" />' :
      `<link rel="stylesheet" href="/css/header.css" />
       <link rel="stylesheet" href="/css/post.css" />
       <link rel="stylesheet" href="/css/main.css" />`;
  const ads = production ? '<script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>' : '';
  return `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>One Piece Treasure Cruise - OPTC Ohara</title>
        ${css}
        <link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css">
        <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-social/4.12.0/bootstrap-social.min.css">
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/latest/css/bootstrap.min.css" />
        <link rel="stylesheet" href="https://unpkg.com/react-select/dist/react-select.min.css">
        <link href='https://fonts.googleapis.com/css?family=Lato:400,300,700' rel='stylesheet' type='text/css'/>
        <link rel="shortcut icon" href="/img/robin_run.png" type="image/png" />
        ${ads}
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
      <script src="/js/ads.js" type="text/javascript"></script>
      <script>
        if (!document.getElementById('dfiehjff89e4rf348fj34f')) {
          document.getElementById('grejvg34598fj34789fju').style.display='block';
        }
      </script>
    </html>
  `;
};

const protected_paths = ['/account', '/posts/api/post'];

// Server Side Rendering based on routes matched by React-router.
/* istanbul ignore next server is hard to test */
app.use((req, res) => {
  match({ routes, location: req.url }, (err, redirectLocation, renderProps) => {
    if (err) {
      return res.status(500).end('Internal server error');
    }

    if (req.url.indexOf('/auth/oauth-signup') !== -1) {
      // If not logged in OR has a username, redirect outta here.
      if (!req.user || (req.user.username && req.user.username.length > 0)) {
        return res.redirect('/');
      }
    }

    // This is an OAuth user with no username set yet. Redirect to get a username.
    if (req.user && !req.user.username && req.url.indexOf('/auth/oauth-signup') === -1) {
      req.flash('info_message', 'You need a username to proceed.');
      return res.redirect('/auth/oauth-signup');
    }

    // Redirect user to set email flow.
    if (req.user && req.user.is_local && !req.user.email &&
        !req.user.asked_for_email &&
        req.url.indexOf('/auth/set-email') === -1) {
      req.flash('info_message',
                    'Please consider setting an email, so we can contact you'
                    + ' if you forget your password. This is optional and'
                    + ' will be your only notice. If you want to set your'
                    + ' email later, please visit your account page.');
      req.user.update({ asked_for_email: true }, (e2, user) => {
        if (e2) {
          console.log('Error updating user with asked_for_email: ', e2);
        }
      });
      return res.redirect('/auth/set-email');
    }

    // Oauth users shouldn't set emails.
    if (req.url.indexOf('/auth/set-email') !== -1 && !req.user.is_local) {
      return res.redirect('/');
    }

    if (protected_paths.indexOf(req.url) !== -1) {
      console.log('Accessing protected path. Checking authentication status...');
      if (!req.isAuthenticated()) {
        // TODO: Maybe redirect to login instead?
        req.flash('error_message', 'Please sign in.');
        return res.redirect('/signup');
      }
    }

    if (!renderProps) {
      return res.status(404).end('Not found!');
    }

    const user = req.user;
    const initialState = { identity: { unit_selections, socket_selections } };
    if (typeof user !== 'undefined') {
        // Clear out sensitive data first.
      user.clearSensitiveData();
    }
    initialState.identity.user = user;
    const info_message = req.flash('info_message')[0];
    let error_message = req.flash('error_message')[0];
    // Find the optional error param if present.
    if (!error_message && req.url.indexOf(SE_PARAM) !== -1) {
      error_message = 'You must sign in to do that.';
    }
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
              <Footer />
            </div>
          </Provider>
        );

        const finalState = store.getState();

        res.status(200).end(renderFullPage(initialView, finalState));
      })
      .catch((err) => {
        console.log('Error in server side rendering: ', err, err.stack);
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

// Require this at the end. We just need the availability checks, we don't need
// to instrument anything - that would take too long for boot.
require('newrelic');

export default app;
