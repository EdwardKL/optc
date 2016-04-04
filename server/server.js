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
import { fetchComponentData } from './util/fetchData';
import serverConfig from './config';

var glob = require('glob'),
  _ = require('lodash');

// MongoDB Connection
mongoose.connect(serverConfig.mongoURL, (error) => {
  if (error) {
    console.error('Please make sure Mongodb is installed and running!'); // eslint-disable-line no-console
    throw error;
  }
});

require('./models/captain');
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

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  var callback = function(err, user) {
    done(err, user);
  };
  User
    .findById(id)
    .populate('accounts._captains')
    .exec(callback);
});
app.use(cookieParser());
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

  // Initialize strategies
getGlobbedFiles('./server/strategies/*.js').forEach(function(strategy) {
	require(path.resolve(strategy))();
});

function getGlobbedFiles(globPatterns, removeRoot) {
  // For context switching
  var _this = this;

  // URL paths regex
  var urlRegex = new RegExp('^(?:[a-z]+:)?\/\/', 'i');

  // The output array
  var output = [];

  // If glob pattern is array so we use each pattern in a recursive way, otherwise we use glob
  if (_.isArray(globPatterns)) {
    globPatterns.forEach(function(globPattern) {
      output = _.union(output, _this.getGlobbedFiles(globPattern, removeRoot));
    });
  } else if (_.isString(globPatterns)) {
    if (urlRegex.test(globPatterns)) {
      output.push(globPatterns);
    } else {
      var files = glob(globPatterns, {sync: true});
      if (removeRoot) {
        files = files.map(function(file) {
          return file.replace(removeRoot, '');
        });
      }
      output = _.union(output, files);

    }
  }

  return output;
};

// NOTE: This has to be done after model require statements.
require('./routes/accounts.routes.js')(app);
require('./routes/users.routes.js')(app);
// Only used to populate unit_selections.
// require('./routes/units.routes.js')(app);
require('./routes/finder.routes.js')(app);
require('./routes/captains.routes.js')(app);

import Header from '../shared/components/Header/Header';
// Render Initial HTML
const renderFullPage = (header_html, body_html, initialState) => {
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
      </head>
      <body id="body">
        ${header_html}
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

import { Alert, Row, Grid } from 'react-bootstrap';
import unit_selections from '../data/unit_selections.json';
import socket_selections from '../data/socket_selections.json';
// Server Side Rendering based on routes matched by React-router.
app.use((req, res) => {
  match({ routes, location: req.url }, (err, redirectLocation, renderProps) => {
    if (err) {
      return res.status(500).end('Internal server error');
    }

    if (!renderProps) {
      return res.status(404).end('Not found!');
    }
    
    if (protected_paths.indexOf(req.url) != -1) {
      console.log('Accessing protected path. Checking authentication status...');
      if (!req.isAuthenticated()) {
        // TODO: Maybe redirect to login instead?
        req.flash('error_message', 'Please sign in.');
        return res.redirect('/signup');
      }
    
      // This is an OAuth user with no username set yet. Redirect to get a username.
      if (req.user && (!req.user.username || req.user.username.length == 0)) {
        req.flash('info_message', 'You need a username to proceed.');
        return res.redirect('/auth/oauth-signup');
      }
    }

    var user = req.user;
    var initialState = {unit_selections: unit_selections, socket_selections: socket_selections};
    if (typeof user != 'undefined') {
        // Clear out sensitive data first.
        user.salt = '';
        user.password = '';
        initialState.user = user;
    }

    const store = configureStore(initialState);
    const info_message = req.flash('info_message');
    const error_message = req.flash('error_message');

    fetchComponentData(store.dispatch, renderProps.components, renderProps.params)
      .then(() => {
        const headerView = renderToString(
            <div>
                <Grid>
                  <Row>
                    {info_message.length > 0 ? <Alert bsStyle="info" id="info-alert">{info_message}</Alert> : <div />}
                    {error_message.length > 0 ? <Alert bsStyle="danger" id="error-alert">{error_message}</Alert> : <div />}
                  </Row>
                </Grid>
            </div>
        );
        const initialView = renderToString(
          <Provider store={store}>
            <div>
              <Header user={req.user} />
              <RouterContext {...renderProps} />
            </div>
          </Provider>
        );
        
        const finalState = store.getState();

        res.status(200).end(renderFullPage(headerView, initialView, finalState));
      })
      .catch(() => {
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
