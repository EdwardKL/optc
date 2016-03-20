var _ = require('lodash'),
  errorHandler = require('../errors.controller'),
  mongoose = require('mongoose'),
  passport = require('passport'),
  User = mongoose.model('User');

/**
 * Signup
 */
exports.signup = function(req, res) {
  console.log("SIGNUP");
  // Init Variables
  var user = new User(req.body);
  var message = null;
  console.log(user);
  // Then save the user
  user.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      // Remove sensitive data before login
      user.password = undefined;
      user.salt = undefined;

      req.login(user, function(err) {
        if (err) {
          console.log(err);
          res.status(400).send(err);
        } else {
          console.log("success");
          res.json(user);
        }
      });
    }
  });
};


/**
 * Signin
 */
exports.signin = function(req, res, next) {

  passport.authenticate('local', function(err, user, info) {
    if (err || !user) {
      res.status(400).send(info);
    } else {
      // Remove sensitive data before login
      user.password = undefined;
      user.salt = undefined;

      req.login(user, function(err) {
        if (err) {
          console.log(err);
          res.status(400).send(err);
        } else {
          res.json(user);
        }
      });
    }
  })(req, res, next);
};

/**
 * Signout
 */
exports.signout = function(req, res) {
  req.logout(function(){
    if(err){
    }
  });
  res.status(200).send({message:"signed out"});
};
