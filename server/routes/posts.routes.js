const posts = require('../controllers/posts.controller');

module.exports = function (app) {
  app.route('/posts/api/get/:location').get(posts.getPosts);
  app.route('/posts/api/post').post(posts.addPost);
};
