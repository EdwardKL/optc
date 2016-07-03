const units = require('../controllers/units.controller');

module.exports = function (app) {
  // Internal use only.
  // app.route('/units/api/all').get(units.getAll);
  app.route('/units/api/id/:id').get(units.fetch);
  app.route('/units/api/ids').get(units.fetchIds);
};
