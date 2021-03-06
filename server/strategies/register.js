let passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  User = require('mongoose').model('User');

module.exports = function () {
  passport.use('register', new LocalStrategy({
    passReqToCallback: true,
  },
    (req, username, password, done) => {
      // Validation
      if (username.length <= 1) {
        return done(null, false, req.flash('error_message', 'Usernames must be at least 2 characters long.'));
      }
      if (!User.validUsername(username)) {
        return done(null, false, req.flash('error_message', 'Username contained invalid characters. Only alphanumeric, dash, and underscore characters are allowed.'));
      }
      if (password.length <= 3) {
        return done(null, false, req.flash('error_message', 'Passwords must be at least 4 characters long.'));
      }
      const password_confirmation = req.body.password_confirmation;
      if (password !== password_confirmation) {
        return done(null, false, req.flash('error_message', 'Password confirmation does not match.'));
      }
      const findOrCreateUser = function () {
        // find a user in Mongo with provided username
        User.findByUsername(username, (err, user) => {
          // In case of any error return
          /* istanbul ignore if */
          if (err) {
            console.log(`Registration error: ${err}`);
            return done(err);
          }
          // already exists
          if (user) {
            return done(null, false, req.flash('error_message', 'User already exists.'));
          }
          var user = new User({
            ...req.body,
            display_name: username,
          });
          user.updateCredentials();
          user.is_local = true;
          const message = null;
          console.log(user);
            // Then save the user
          user.save((err) => {
              /* istanbul ignore if */
            if (err) {
              console.log(`Error saving user: ${err}`);
              throw err;
            } else {
              console.log('Registration successful');
              return done(null, user);
            }
          });
        });
      };

      // Delay the execution of findOrCreateUser and execute
      // the method in the next tick of the event loop
      process.nextTick(findOrCreateUser);
    }));
};
