import Post from '../models/post';
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
