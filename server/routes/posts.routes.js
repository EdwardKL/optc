const posts = require('../controllers/posts.controller');

module.exports = function (app) {
  app.route('/posts/api/get/:location').get(posts.getPosts);
  app.route('/posts/api/post').post(posts.addPost);
  app.route('/posts/api/vote').post(posts.toggleVote);
  app.route('/posts/api/post_vote/:post_id/:user_id').get(posts.fetchPostVotes);
};
