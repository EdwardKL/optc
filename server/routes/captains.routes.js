var captains = require('../controllers/captains.controller');

module.exports = function(app) {
  app.route('/captains/add').post(captains.add);
};