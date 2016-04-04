var passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  User = require('mongoose').model('User');

module.exports = function() {
  passport.use(new LocalStrategy({
      passReqToCallback: true
    },
    function (req, username, password, done) {
      // Check in mongo if a user with username exists or not
      User.findByUsername(username, function (err, user) {
        // In case of any error, return using the done method
        if (err)
          return done(err);
        // Username does not exist, log error & redirect back
        if (!user) {
          return done(null, false, req.flash('error_message', 'User not found.'));
        }
        // User exists but wrong password, log the error
        if (!user.authenticate(password)) {
          return done(null, false, req.flash('error_message', 'Invalid password.'));
        }
        // User and password both match, return user from
        // done method which will be treated like success
        return done(null, user, req.flash('info_message', 'Welcome, ' + user.display_name + '!'));
      });
    }));
}
