const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('mongoose').model('User');

module.exports = function () {
  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: 'https://optc.herokuapp.com/auth/facebook/callback',
  },
    (accessToken, refreshToken, profile, done) => {
      /* istanbul ignore next non-local strategies are hard to test */
      User.findOne({ _facebook_id: profile.id },
        (err, user) => {
          if (err) {
            return done(err);
          }
          if (!user) {
            user = new User({ _facebook_id: profile.id });
            user.save(function (err) {
              if (err) console.log(err);
              return done(err, user);
            });
          } else {
            return done(null, user);
          }
        }
      );
    }));
};
