import Post from '../models/post';
import PostVote from '../models/post_vote';
import sanitizeHtml from 'sanitize-html';
import { redirectIfLoggedOut, areIdsEqual } from './utils';

exports.addPost = function (req, res, next) {
  if (redirectIfLoggedOut(req, res, next)) return;
  if (!req.body.post_content) {
    next();
    return;
  }

  const post = new Post();
  post.content = sanitizeHtml(req.body.post_content);
  post.location = req.body.location;
  post._user = req.user._id;

  if (req.body.parent_id) {
    post._parent = req.body.parent_id;
  }

  post.save((err, saved) => {
    if (err) {
      req.flash('error_message', 'There was an error saving this post. Try again later.');
    }
    next();
    return;
  });
};

const getNode = function (post) {
  const node = {};
  node.post = post;
  node.children = [];
  return node;
};

// Returns a hierachy of posts, ordered first by score, then by date added.
// These are formatted as nodes, objects as follows:
// { post, children: [nodes] }
exports.getPosts = function (req, res, next) {
  Post.find({ location: req.body.location }).sort('-score -date_added').exec((err, raw_posts) => {
    if (err) {
      return res.status(500).send(err);
    }
    const posts = [];
    const node_map = new Map();
    raw_posts.map((post) => {
      node_map.set(post._id.toString().valueOf(), getNode(post));
    });
    raw_posts.map((post) => {
      const node = node_map.get(post._id.toString().valueOf());
      if (post._parent && node_map.has(post._parent.toString().valueOf())) {
        const parent = node_map.get(post._parent.toString().valueOf());
        parent.children.push(node);
      } else {
        posts.push(node);
      }
    });
    res.json({ posts });
    next();
    return;
  });
};

// Expects the post_id in the body of the request.
exports.deletePost = function (req, res, next) {
  if (redirectIfLoggedOut(req, res, next)) return;
  Post.findById(req.body.post_id).exec((err, post) => {
    if (areIdsEqual(req.user._id, post._user)) {
      post.remove(() => {
        next();
        return;
      });
    } else {
      next();
      return;
    }
  });
};

const updateScore = function updateScore(post_id, score_diff, next) {
  Post.findById(post_id).exec((err, post) => {
    if (!post) {
      next();
      return;
    }
    post.update({ $inc: { score: score_diff } }).exec(next);
  });
};

// Expects the post_id and a bool upvote in the body of the request.
// If the upvote value is the same as the one stored, it will be removed.
exports.toggleVote = function (req, res, next) {
  if (redirectIfLoggedOut(req, res, next)) return;
  PostVote.find({ _user: req.user._id, _post: req.body.post_id }).exec((err, pv) => {
    let score_diff = 0;
    let post_vote;
    if (pv && pv.length == 1) {
      post_vote = pv[0];
      if (req.body.upvote == post_vote.upvote) {
        // Removing an upvote means reducing the score by 1.
        score_diff = post_vote.upvote ? -1 : 1;
        post_vote.remove(() => {
          updateScore(req.body.post_id, score_diff, next);
          return;
        });
        return;
      }
      // Converting an upvote to a downvote (or vice versa) has double the magnitude.
      score_diff = post_vote.upvote ? -2 : 2;
    } else {
      post_vote = new PostVote();
      post_vote._user = req.user._id;
      post_vote._post = req.body.post_id;
      score_diff = req.body.upvote ? 1 : -1;
    }
    post_vote.upvote = req.body.upvote;
    post_vote.save((err) => {
      updateScore(req.body.post_id, score_diff, next);
    });
  });
};
