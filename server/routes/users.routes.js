
module.exports = function(app) {
  var passport = require('passport');
  var crypto = require('crypto');

  app.route('/signup').post(passport.authenticate('register', { successRedirect: '/',
	   						          failureRedirect: '/signup',
								      failureFlash: true }));
  app.route('/signin').post(passport.authenticate('local', { successRedirect: '/',
								   failureRedirect: '/signup',
								   failureFlash: true }));

  // Facebook signin routes
  app.route('/auth/facebook').get(passport.authenticate('facebook'));
  app.route('/auth/facebook/callback').get(passport.authenticate('facebook', { successRedirect: '/', failureRedirect: '/signup' }));
  
  // Google signin routes
  app.route('/auth/google').get(passport.authenticate('google', { scope: ['profile'] }));
  app.route('/auth/google/callback').get(passport.authenticate('google', { successRedirect: '/', failureRedirect: '/signup' }));
  
  // Reddit signin routes
  app.route('/auth/reddit').get(function(req, res, next) {
	req.session.state = crypto.randomBytes(32).toString('hex');
	passport.authenticate('reddit', { state: req.session.state, duration: 'permanent' })(req, res, next);
  });
  app.route('/auth/reddit/callback').get(function(req, res, next) {
    if (req.query.state == req.session.state) {
	  passport.authenticate('reddit', { successRedirect: '/', failureRedirect: '/signup' })(req, res, next);
	} else {
	  next(new Error(403));
	}
  });
  
  // Twitter signin routes
  app.route('/auth/twitter').get(passport.authenticate('twitter'));
  app.route('/auth/twitter/callback').get(passport.authenticate('twitter', { successRedirect: '/', failureRedirect: '/signup' }));
};
