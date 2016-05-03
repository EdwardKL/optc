import passport from 'passport';
import crypto from 'crypto';
import users from '../controllers/users.controller';

module.exports = function user_routes(app) {
  // Auth
  app.route('/signup').post(passport.authenticate('register', { successRedirect: '/', failureRedirect: '/signup', failureFlash: true }));

  app.route('/login').post((req, res, next) => {
    if (!req.body.password || !req.body.username || req.body.password === '' || req.body.username === '') {
      req.flash('error_message', 'Please enter both a username and password to login.');
      res.redirect('/signup');
      return;
    }
    next();
  }, passport.authenticate('local', { successRedirect: '/', failureRedirect: '/signup', failureFlash: true }));

  /* istanbul ignore next can't seem to fake a login properly to have this not crash in test */
  app.route('/logout').get((req, res) => {
    const display_name = req.user.display_name ? `, ${req.user.display_name}` : '';
    req.flash('info_message', `Bye${display_name}!`);
    req.logout();
    res.redirect('/');
  });

  app.route('/auth/editpass').post(users.editPass);
  app.route('/auth/delete').post(users.delete);
  app.route('/auth/oauth-signup').post(users.setUser);

  // Facebook signin routes
  /* istanbul ignore next oauth hard to test */
  app.route('/auth/facebook').get(passport.authenticate('facebook'));
  /* istanbul ignore next oauth hard to test */
  app.route('/auth/facebook/callback').get(passport.authenticate('facebook', { successRedirect: '/', failureRedirect: '/signup' }));

  // Google signin routes
  /* istanbul ignore next oauth hard to test */
  app.route('/auth/google').get(passport.authenticate('google', { scope: ['profile'] }));
  /* istanbul ignore next oauth hard to test */
  app.route('/auth/google/callback').get(passport.authenticate('google', { successRedirect: '/', failureRedirect: '/signup' }));

  // Reddit signin routes
  /* istanbul ignore next oauth hard to test */
  app.route('/auth/reddit').get((req, res, next) => {
    req.session.state = crypto.randomBytes(32).toString('hex');  // eslint-disable-line no-param-reassign
    passport.authenticate('reddit', { state: req.session.state, duration: 'permanent' })(req, res, next);
  });
  /* istanbul ignore next oauth hard to test */
  app.route('/auth/reddit/callback').get((req, res, next) => {
    if (req.query.state === req.session.state) {
      passport.authenticate('reddit', { successRedirect: '/', failureRedirect: '/signup' })(req, res, next);
    } else {
      next(new Error(403));
    }
  });

  // Twitter signin routes
  /* istanbul ignore next oauth hard to test */
  app.route('/auth/twitter').get(passport.authenticate('twitter'));
  /* istanbul ignore next oauth hard to test */
  app.route('/auth/twitter/callback').get(passport.authenticate('twitter', { successRedirect: '/', failureRedirect: '/signup' }));
};
