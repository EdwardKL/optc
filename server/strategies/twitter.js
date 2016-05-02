/* istanbul ignore next non-local strategies are hard to test */
var passport = require('passport'),
  TwitterStrategy = require('passport-twitter').Strategy,
  User = require('mongoose').model('User');

module.exports = function () {
  passport.use(new TwitterStrategy({
    consumerKey: process.env.TWITTER_ID,
    consumerSecret: process.env.TWITTER_SECRET,
    callbackURL: 'https://optc.herokuapp.com/auth/twitter/callback'
  },
    function (token, tokenSecret, profile, done) {
      User.findOne({ '_twitter_id': profile.id },
        function (err, user) {
          if (err) {
            return done(err);
          }
          if (!user) {
            user = new User({ _twitter_id: profile.id });
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
