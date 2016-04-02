var units = require('../controllers/units.controller');

module.exports = function(app) {
  app.route('/units/all').get(units.getAll);
};
