var accounts = require('../controllers/accounts.controller');

module.exports = function (app) {
  app.route('/accounts/add').post(accounts.add);
  app.route('/accounts/delete/:id').get(accounts.delete);
  app.route('/accounts/:username').get(accounts.get);
  app.route('/account').get(accounts.redirect);
};
