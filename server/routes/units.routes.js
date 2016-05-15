const units = require('../controllers/units.controller');

module.exports = function (app) {
  // Internal use only.
  // app.route('/units/api/all').get(units.getAll);
  app.route('/units/api/:id').get(units.fetch);
};
