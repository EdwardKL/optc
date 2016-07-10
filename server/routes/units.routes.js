const units = require('../controllers/units.controller');

module.exports = function (app) {
  // Internal use only.
  // app.route('/units/api/all').get(units.getAll);
  app.route('/units/api/id/:id').get(units.fetch);
  app.route('/units/api/id_and_names').get(units.fetchIdAndNames);
  app.route('/units/api/recommend/:id/:recommended').get(units.recommend);
  app.route('/units/api/recommendations/:id').get(units.fetchGlobalRecommendations);
  app.route('/units/api/recommendation/:id/:user_id').get(units.fetchRecommendation);
};
