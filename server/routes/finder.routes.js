var friend_finder = require('../controllers/friend_finder.controller');

module.exports = function(app) {
  app.route('/friend_finder/api/:captain_id').get(friend_finder.search);
  app.route('/friend_finder/api/num_pages/:captain_id').get(friend_finder.fetchNumPages);
};
