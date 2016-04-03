var passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  User = require('mongoose').model('User');

module.exports = function() {
  passport.use('register', new LocalStrategy({
      passReqToCallback: true
    },
    function (req, username, password, done) {
        // Validation
        if (username.length <= 1) {
            return done(null, false, req.flash('error_message', 'Usernames must be at least 2 characters long.'));
        }
        if (password.length <= 3) {
            return done(null, false, req.flash('error_message', 'Passwords must be at least 4 characters long.'));
        }
        var password_confirmation = req.body['password_confirmation'];
        if (password != password_confirmation) {
            return done(null, false, req.flash('error_message', 'Password confirmation does not match.'));
        }
        var findOrCreateUser = function(){
            // find a user in Mongo with provided username
            User.findOne({ 'username' : username }, function(err, user) {
                // In case of any error return
                if (err){
                    console.log('Registration error: '+err);
                    return done(err);
                }
                // already exists
                if (user) {
                  return done(null, false, req.flash('error_message', 'User already exists.'));
                } else {
                  var user = new User(req.body);
                  user.updateCredentials();
                  user.is_local = true;
                  var message = null;
                  console.log(user);
                  // Then save the user
                  user.save(function(err) {
                    if (err) {
                      console.log('Error saving user: '+err);  
                      throw err;  
                    } else {
                        console.log('Registration successful');    
                        return done(null, user);
                    }
                  });
                }
              });
		};
		 
		// Delay the execution of findOrCreateUser and execute 
		// the method in the next tick of the event loop
		process.nextTick(findOrCreateUser);
    }));
}
