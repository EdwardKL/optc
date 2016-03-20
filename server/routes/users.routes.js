
module.exports = function(app) {
  var users = require('../controllers/users.controller');

  // Get all Users
  //app.route('/getUsers').get(UserController.getUsers);

  app.route('/auth/signup').post(users.signup);
  app.route('/auth/signin').post(users.signin);
  app.route('/auth/signout').get(users.signout);
}


//module.exports = function(app) {
//  // User Routes
//  var users = require('../controllers/users.controller');
//
//  // Setting up the users profile api
//  app.route('/users/me').get(users.me);
//  app.route('/users/:userId').get(users.read);
//  app.route('/users/:userId').put(users.update);
//  app.route('/users/accounts').delete(users.removeOAuthProvider);
//
//  // Setting up the users password api
//  app.route('/users/password').post(users.changePassword);
//  app.route('/auth/forgot').post(users.forgot);
//  app.route('/auth/reset/:token').get(users.validateResetToken);
//  app.route('/auth/reset/:token').post(users.reset);
//
//  // Setting up the users authentication api
//  app.route('/auth/signup').post(users.signup);
//  app.route('/auth/signin').post(users.signin);
//  app.route('/auth/signout').get(users.signout);
//
//  app.param('userId', users.userByID);
//};
