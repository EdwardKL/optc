var passport = require('passport'),
  RedditStrategy = require('passport-reddit').Strategy,
  User = require('mongoose').model('User');

module.exports = function () {
  passport.use(new RedditStrategy({
    clientID: process.env.REDDIT_ID,
    clientSecret: process.env.REDDIT_SECRET,
    callbackURL: 'https://optc.herokuapp.com/auth/reddit/callback'
  },
    function (accessToken, refreshToken, profile, done) {
      /* istanbul ignore next non-local strategies are hard to test */
      User.findOne({ '_reddit_id': profile.id },
        function (err, user) {
          if (err) {
            return done(err);
          }
          if (!user) {
            user = new User({ _reddit_id: profile.id });
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
