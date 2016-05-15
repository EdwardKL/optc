var captains = require('../controllers/captains.controller');

module.exports = function (app) {
  app.route('/captains/add').post(captains.add);
  app.route('/captains/delete/:account_id/:captain_id').get(captains.delete);
};
