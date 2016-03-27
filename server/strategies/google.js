var passport = require('passport'),
  GoogleStrategy = require('passport-google-oauth20').Strategy,
  User = require('mongoose').model('User');

module.exports = function() {
  passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: "https://optc.herokuapp.com/auth/google/callback"
    },
    function(accessToken, refreshToken, profile, done) {
	  console.log("Starting google auth...");
      User.findOne({'_google_id': profile.id},
        function (err, user) {
          if (err) {
            return done(err);
          }
          if (!user) {
            user = new User({_google_id: profile.id});
            user.save(function(err) {
              if (err) console.log(err);
              return done(err, user);
            });
          } else {
            return done(null, user);
          }
        }
      );
    }));
}
