import Post from '../models/post';
import PostVote from '../models/post_vote';
import sanitizeHtml from 'sanitize-html';
import { redirectIfLoggedOut, areIdsEqual, convertLocationString } from './utils';
import POST_VOTE from '../../constants/post_vote';

exports.addPost = function (req, res, next) {
  console.log('POSTS_CONTROLLER checking req body: ', req.body, ' and req.user: ', req.user);
  if (redirectIfLoggedOut(req, res, next)) return;
  if (!req.body.post_content) {
    next();
    return;
  }
  console.log('POSTS_CONTROLLER adding post: ', req.body.post_content, ' to location: ', req.body.location);
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
    console.log('post successfully saved');
    res.redirect(convertLocationString(req.body.location));
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

// Returns a hierarchy of posts, ordered first by score, then by date added.
// These are formatted as nodes, objects as follows:
// { post, children: [nodes] }
exports.getPosts = function (req, res, next) {
  Post.find({ location: req.params.location })
    .populate('_user')
    .sort('-score -date_added')
    .exec((err, raw_posts) => {
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
      console.log('returning posts: ', posts);
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

const updateScore = function updateScore(post_id, score_diff, res, next) {
  Post.findByIdAndUpdate(post_id, { $inc: { score: score_diff } }, { new: true })
    .populate('_user')
    .exec((err, post) => {
      if (!post) {
        next();
        return;
      }
      console.log('updateScore returning post: ', post);
      res.json(post);
      next();
      return;
  });
};

// Expects the post_id and a bool upvote in the body of the request.
// If the upvote value is the same as the one stored, it will be removed.
exports.toggleVote = function (req, res, next) {
  if (redirectIfLoggedOut(req, res, next)) return;
  console.log('toggling post vote with req.body: ', req.body);
  PostVote.find({ _user: req.user._id, _post: req.body.post_id }).exec((err, pv) => {
    console.log('finding vote for postid: ', req.body.post_id);
    let score_diff = 0;
    let post_vote;
    if (pv && pv.length == 1) {
      post_vote = pv[0];
      console.log('vote found: ', post_vote.upvote);
      if (req.body.upvote == post_vote.upvote) {
        // Removing an upvote means reducing the score by 1.
        score_diff = post_vote.upvote ? -1 : 1;
        post_vote.remove(() => {
          updateScore(req.body.post_id, score_diff, res, next);
          return;
        });
        return;
      }
      // Converting an upvote to a downvote (or vice versa) has double the magnitude.
      score_diff = post_vote.upvote ? -2 : 2;
    } else {
      console.log('vote not found, creating new vote');
      post_vote = new PostVote();
      post_vote._user = req.user._id;
      post_vote._post = req.body.post_id;
      score_diff = req.body.upvote ? 1 : -1;
    }
    post_vote.upvote = req.body.upvote;
    post_vote.save((err) => {
      updateScore(req.body.post_id, score_diff, res, next);
    });
  });
};

exports.fetchPostVotes = function (req, res, next) {
  const post_id = req.params.post_id;
  const user_id = req.params.user_id;
  console.log('POSTS_CONTROLLER: fetching postvote with postID: ', post_id, ' userID: ', user_id);
  if (!user_id || user_id === 'null') {
    res.json({post_id: post_id, vote: POST_VOTE.NONE});
    next();
    return;
  }
  PostVote.findOne({ _user: user_id, _post: post_id})
    .exec((err, pv) => {
      if (!err && pv) {
        const post_vote = pv.upvote ? POST_VOTE.UPVOTE : POST_VOTE.DOWNVOTE;
        res.json({post_id: post_id, vote: post_vote});
      } else {
        res.json({post_id: post_id, vote: POST_VOTE.NONE});
      }
      next();
      return;
    })
};
