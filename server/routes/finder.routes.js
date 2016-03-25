var friend_finder = require('../controllers/friend_finder.controller');

module.exports = function(app) {
  app.route('/friend_finder').post(friend_finder.search);
};