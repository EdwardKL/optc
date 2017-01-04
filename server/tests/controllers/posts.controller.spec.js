/* eslint-disable no-unused-expressions no-underscore-dangle */

import chai from 'chai';
import mongoose from 'mongoose';
import PostsController from '../../controllers/posts.controller';
import PostModel from '../../models/post';
import PostVoteModel from '../../models/post_vote';
import UserModel from '../../models/user';
import RequestMock from '../mocks/request.mock';
import ResponseMock from '../mocks/response.mock';
import { connectToTestDB, dropTestDB } from '../test_utils';
import POST_VOTE from '../../../constants/post_vote';

const expect = chai.expect;

describe('PostsController when logged out', () => {
  // Req has no user. This is to simulate the user being logged out.
  const req = new RequestMock();
  const res = new ResponseMock();

  const expectRedirect = function expectRedirect(done) {
    return function expectRedirectCB(cb) {
      expect(req.getFlash('error_message')).to.equal('Please sign in.');
      expect(res.getRedirectPath()).to.equal('/signup');
      cb();
    }.bind(this, done);
  };

  it('should redirect to /signup for .addPost', (done) => {
    PostsController.addPost(req, res, expectRedirect(done));
  });

  it('should redirect to /signup for .deletePost', (done) => {
    PostsController.deletePost(req, res, expectRedirect(done));
  });

  it('should redirect to /signup for .toggleVote', (done) => {
    PostsController.toggleVote(req, res, expectRedirect(done));
  });
});

describe('PostsController.getPosts when logged out', () => {
  const req = new RequestMock();
  const res = new ResponseMock();

  const irrelevant_post = new PostModel({
    content: 'should not be here',
    location: 'bad location',
  });

  const relevant_post = new PostModel({
    content: 'should be here',
    location: '/page/loc',
  });

  before(function before(done) {  // eslint-disable-line prefer-arrow-callback
    connectToTestDB(() => {
      irrelevant_post.save((err) => {
        if (err) throw err;
        relevant_post.save(() => {
          done();
        });
      });
    });
  });

  it('should show relevant posts', (done) => {
    req.setParams({ location: '/page/loc' });
    PostsController.getPosts(req, res, () => {
      expect(res.getJson().posts).to.have.lengthOf(1);
      const expected_post = res.getJson().posts[0];
      expect(expected_post.children).to.have.lengthOf(0);
      expect(expected_post.post.content).to.equal('should be here');
      done();
    });
  });

  after(function after(done) {  // eslint-disable-line prefer-arrow-callback
    dropTestDB(done);
  });
});

describe('PostsController.getPosts when logged out', () => {
  const req = new RequestMock();
  const res = new ResponseMock();

  const post_high_score_older = new PostModel({
    content: 'post high score older',
    location: '/page/loc',
    score: 10,
    date_added: new Date(2000, 1, 1),
  });

  const post_low_score_older = new PostModel({
    content: 'post low score older',
    location: '/page/loc',
    date_added: new Date(2000, 1, 1),
  });

  const post_high_score_newer = new PostModel({
    content: 'post high score newer',
    location: '/page/loc',
    score: 10,
    date_added: new Date(2010, 1, 1),
  });

  const post_med_score_newer = new PostModel({
    content: 'post med score newer',
    location: '/page/loc',
    score: 5,
    date_added: new Date(2010, 1, 1),
  });

  const post_low_score_newer = new PostModel({
    content: 'post low score newer',
    location: '/page/loc',
    date_added: new Date(2010, 1, 1),
  });

  before(function before(done) {  // eslint-disable-line prefer-arrow-callback
    connectToTestDB(() => {
      post_low_score_older.save(() => {
        post_high_score_newer.save(() => {
          post_med_score_newer.save(() => {
            post_low_score_newer.save(() => {
              post_high_score_older.save(() => {
                done();
              });
            });
          });
        });
      });
    });
  });

  // Sort by score first, then date.
  // 1. post_high_score_newer
  // 2. post_high_score_older
  // 3. post_med_score_newer
  // 4. post_low_score_newer
  // 5. post_low_score_older
  it('should sort posts properly', (done) => {
    req.setParams({ location: '/page/loc' });
    PostsController.getPosts(req, res, () => {
      expect(res.getJson().posts).to.have.lengthOf(5);
      expect(res.getJson().posts[0].post.content).to.equal('post high score newer');
      expect(res.getJson().posts[1].post.content).to.equal('post high score older');
      expect(res.getJson().posts[2].post.content).to.equal('post med score newer');
      expect(res.getJson().posts[3].post.content).to.equal('post low score newer');
      expect(res.getJson().posts[4].post.content).to.equal('post low score older');
      done();
    });
  });

  after(function after(done) {  // eslint-disable-line prefer-arrow-callback
    dropTestDB(done);
  });
});

describe('PostsController.getPosts when logged out', () => {
  const req = new RequestMock();
  const res = new ResponseMock();

  const orphan = new PostModel({
    content: 'orphan',
    location: '/page/loc',
    score: 1,
  });

  const parent1 = new PostModel({
    content: 'parent1',
    location: '/page/loc',
    score: 10,
  });

  const child1 = new PostModel({
    content: 'parent1 child1',
    location: '/page/loc',
    _parent: parent1._id,
  });

  const child2 = new PostModel({
    content: 'parent1 child2',
    location: '/page/loc',
    _parent: parent1._id,
    score: 5,
  });

  const grandchild = new PostModel({
    content: 'child2 grandchild',
    location: '/page/loc',
    _parent: child2._id,
    score: 9999,
  });

  const parent2 = new PostModel({
    content: 'parent2',
    location: '/page/loc',
    score: 5,
  });

  const child3 = new PostModel({
    content: 'parent2 child3',
    location: '/page/loc',
    _parent: parent2._id,
  });

  before(function before(done) {  // eslint-disable-line prefer-arrow-callback
    connectToTestDB(() => {
      orphan.save(() => {
        parent1.save(() => {
          child3.save(() => {
            grandchild.save(() => {
              parent2.save(() => {
                child1.save(() => {
                  child2.save(() => {
                    done();
                  });
                });
              });
            });
          });
        });
      });
    });
  });

  it('should calculate hierarchies properly', (done) => {
    req.setParams({ location: '/page/loc' });
    PostsController.getPosts(req, res, () => {
      expect(res.getJson().posts).to.have.lengthOf(3);

      expect(res.getJson().posts[0].post.content).to.equal('parent1');
      expect(res.getJson().posts[0].children).to.have.lengthOf(2);

      expect(res.getJson().posts[0].children[0].post.content).to.equal('parent1 child2');
      expect(res.getJson().posts[0].children[0].children).to.have.lengthOf(1);
      expect(res.getJson().posts[0].children[0].children[0].post.content).to.equal('child2 grandchild');

      expect(res.getJson().posts[0].children[1].post.content).to.equal('parent1 child1');
      expect(res.getJson().posts[0].children[1].children).to.have.lengthOf(0);

      expect(res.getJson().posts[1].post.content).to.equal('parent2');
      expect(res.getJson().posts[1].children).to.have.lengthOf(1);

      expect(res.getJson().posts[1].children[0].post.content).to.equal('parent2 child3');
      expect(res.getJson().posts[1].children[0].children).to.have.lengthOf(0);

      expect(res.getJson().posts[2].post.content).to.equal('orphan');
      expect(res.getJson().posts[2].children).to.have.lengthOf(0);
      done();
    });
  });

  after(function after(done) {  // eslint-disable-line prefer-arrow-callback
    dropTestDB(done);
  });
});

describe('PostsController.addPost', () => {
  const req = new RequestMock();
  const res = new ResponseMock();
  const _id = new mongoose.Types.ObjectId();
  const username = 'test-user';
  const user = new UserModel({ _id, username });
  req.login(user);

  beforeEach(function beforeEach(done) {  // eslint-disable-line prefer-arrow-callback
    connectToTestDB(() => {
      done();
    });
  });

  const location = 'some/location';
  const post_content = 'some content';

  it('should add orphan posts properly', (done) => {
    req.setBody({ location, post_content });
    PostsController.addPost(req, res, () => {
      PostModel.find({ location }).exec((err, posts) => {
        expect(posts).to.have.lengthOf(1);
        expect(posts[0].content).to.equal(post_content);
        expect(posts[0].location).to.equal(location);
        expect(posts[0]._parent).to.not.exist;
        expect(posts[0]._user.toString().valueOf()).to.equal(_id.toString().valueOf());
        done();
      });
    });
  });

  const parent_id = new mongoose.Types.ObjectId();

  it('should add child posts properly', (done) => {
    req.setBody({ location, post_content, parent_id });
    PostsController.addPost(req, res, () => {
      PostModel.find({ location }).exec((err, posts) => {
        expect(posts).to.have.lengthOf(1);
        expect(posts[0].content).to.equal(post_content);
        expect(posts[0].location).to.equal(location);
        expect(posts[0]._parent.toString().valueOf()).to.equal(parent_id.toString().valueOf());
        expect(posts[0]._user.toString().valueOf()).to.equal(_id.toString().valueOf());
        done();
      });
    });
  });

  afterEach(function afterEach(done) {  // eslint-disable-line prefer-arrow-callback
    dropTestDB(done);
  });
});

describe('PostsController.deletePost', () => {
  const req = new RequestMock();
  const res = new ResponseMock();
  const _id = new mongoose.Types.ObjectId();
  const username = 'test-user';
  const user = new UserModel({ _id, username });
  req.login(user);

  const unowned_post = new PostModel({
    _user: new mongoose.Types.ObjectId(),
    content: 'unowned',
    location: '/page/loc',
    score: 5,
  });

  const post1 = new PostModel({
    content: 'post1',
    location: '/page/loc',
    _user: user._id,
  });

  const post2 = new PostModel({
    content: 'post2',
    location: '/page/loc',
    _user: user._id,
  });

  before(function before(done) {  // eslint-disable-line prefer-arrow-callback
    connectToTestDB(() => {
      unowned_post.save(() => {
        post1.save(() => {
          post2.save(() => {
            done();
          });
        });
      });
    });
  });

  it('should not delete unowned posts', (done) => {
    const post_id = unowned_post._id;
    req.setBody({ post_id });
    PostsController.deletePost(req, res, () => {
      PostModel.findById(post_id).exec((err, post) => {
        expect(post.content).to.equal('unowned');
        done();
      });
    });
  });

  it('should delete owned posts properly', (done) => {
    const post_id = post1._id;
    req.setBody({ post_id });
    PostsController.deletePost(req, res, () => {
      PostModel.findById(post_id).exec((err, posts) => {
        expect(posts).to.not.exist;
        done();
      });
    });
  });

  after(function after(done) {  // eslint-disable-line prefer-arrow-callback
    dropTestDB(done);
  });
});


describe('PostsController.toggleVote', () => {
  const req = new RequestMock();
  const res = new ResponseMock();
  const user1_id = new mongoose.Types.ObjectId();
  const user2_id = new mongoose.Types.ObjectId();
  const post_id = new mongoose.Types.ObjectId();
  const username = 'test-user';
  const username2 = 'test-user-2';
  const user = new UserModel({ _id: user1_id, username });
  const user2 = new UserModel({ _id: user2_id, username2 });
  req.login(user);

  beforeEach(function beforeEach(done) { // eslint-disable-line prefer-arrow-callback
    const post1 = new PostModel({
      _id: post_id,
      content: 'post1',
      location: '/page/loc',
      _user: user1_id,
      score: 10,
    });

    const post2 = new PostModel({
      content: 'post2',
      location: '/page/loc',
      _user: user2_id,
    });

    connectToTestDB(() => {
      post1.save(() => {
        post2.save(() => {
          done();
        });
      });
    });
  });

  it('should upvote previously unvoted posts', (done) => {
    const upvote = true;
    req.setBody({ post_id, upvote });
    PostsController.toggleVote(req, res, () => {
      PostModel.findById(post_id).exec((err, post) => {
        // Score should go up one.
        expect(post.score).to.equal(11);
        PostVoteModel.find({ _user: user1_id, _post: post_id }).exec((err, post_vote) => {
          // Should be a post vote stored.
          expect(post_vote[0].upvote).to.be.true;
          done();
        });
      });
    });
  });

  it('should downvote previously unvoted posts', (done) => {
    const upvote = false;
    req.setBody({ post_id, upvote });
    PostsController.toggleVote(req, res, () => {
      PostModel.findById(post_id).exec((err, post) => {
        // Score should go down one.
        expect(post.score).to.equal(9);
        PostVoteModel.find({ _user: user1_id, _post: post_id }).exec((err, post_vote) => {
          // Should be a post vote stored.
          expect(post_vote[0].upvote).to.be.false;
          done();
        });
      });
    });
  });

  it('should upvote toggle', (done) => {
    const upvote = true;
    req.setBody({ post_id, upvote });
    PostsController.toggleVote(req, res, () => {
      // Toggle it away.
      PostsController.toggleVote(req, res, () => {
        PostModel.findById(post_id).exec((err, post) => {
          // Score should not change.
          expect(post.score).to.equal(10);
          PostVoteModel.find({ _user: user1_id, _post: post_id }).exec((err, post_vote) => {
            // Post vote should not exist.
            expect(post_vote[0]).to.not.exist;
            done();
          });
        });
      });
    });
  });

  it('should downvote toggle', (done) => {
    const upvote = false;
    req.setBody({ post_id, upvote });
    PostsController.toggleVote(req, res, () => {
      // Toggle it away.
      PostsController.toggleVote(req, res, () => {
        PostModel.findById(post_id).exec((err, post) => {
          // Score should not change.
          expect(post.score).to.equal(10);
          PostVoteModel.find({ _user: user1_id, _post: post_id }).exec((err, post_vote) => {
            // Post vote should not exist.
            expect(post_vote[0]).to.not.exist;
            done();
          });
        });
      });
    });
  });

  it('should go from upvote to downvote', (done) => {
    const upvote = true;
    req.setBody({ post_id, upvote });
    const req2 = new RequestMock();
    req2.login(user);
    req2.setBody({ post_id, upvote: false });
    PostsController.toggleVote(req, res, () => {
      // Change mind, downvote instead.
      PostsController.toggleVote(req2, res, () => {
        PostModel.findById(post_id).exec((err, post) => {
          // Score should be down 1.
          expect(post.score).to.equal(9);
          PostVoteModel.find({ _user: user1_id, _post: post_id }).exec((err, post_vote) => {
            // Should be a post vote stored.
            expect(post_vote[0].upvote).to.be.false;
            done();
          });
        });
      });
    });
  });

  it('should go from downvote to upvote', (done) => {
    const upvote = false;
    req.setBody({ post_id, upvote });
    const req2 = new RequestMock();
    req2.login(user);
    req2.setBody({ post_id, upvote: true });
    PostsController.toggleVote(req, res, () => {
      // Change mind, upvote instead.
      PostsController.toggleVote(req2, res, () => {
        PostModel.findById(post_id).exec((err, post) => {
          // Score should be up 1.
          expect(post.score).to.equal(11);
          PostVoteModel.find({ _user: user1_id, _post: post_id }).exec((err, post_vote) => {
            // Should be a post vote stored.
            expect(post_vote[0].upvote).to.be.true;
            done();
          });
        });
      });
    });
  });

  it('should store multiple user votes', (done) => {
    const upvote = false;
    req.setBody({ post_id, upvote });
    const req2 = new RequestMock();
    req2.login(user2);
    req2.setBody({ post_id, upvote: true });
    PostsController.toggleVote(req, res, () => {
      // Other user upvotes.
      PostsController.toggleVote(req2, res, () => {
        PostModel.findById(post_id).exec((err, post) => {
          // Score should be the same.
          expect(post.score).to.equal(10);
          PostVoteModel.find({ _post: post_id }).exec((err, post_votes) => {
            // Should be 2 post votes stored.
            expect(post_votes).to.have.lengthOf(2);
            done();
          });
        });
      });
    });
  });

  afterEach(function afterEach(done) {  // eslint-disable-line prefer-arrow-callback
    dropTestDB(done);
  });
});


describe('PostsController.fetchPostVotes', () => {
  const req = new RequestMock();
  const res = new ResponseMock();
  const user_id = new mongoose.Types.ObjectId();
  const username = 'test-user-vc';
  const user = new UserModel({ user_id, username });
  const post_id1 = new mongoose.Types.ObjectId();
  const post_id2 = new mongoose.Types.ObjectId();

  req.login(user);

  const post_vote1 = new PostVoteModel({
    _user: user_id,
    _post: post_id1,
    upvote: false,
  });

  const post_vote2 = new PostVoteModel({
    _user: user_id,
    _post: post_id2,
    upvote: true,
  });

  before('Store post votes', function before(done) {
    connectToTestDB(() => {
      post_vote1.save((err) => {
        post_vote2.save(done);
      });
    });
  });

  it('return NONE for null string user', (done) => {
    req.setParams({ user_id: 'null'});
    PostsController.fetchPostVotes(req, res, () => {
      const postVoteResponse = res.getJson();
      expect(postVoteResponse.vote).to.equal(POST_VOTE.NONE);
      done();
    });
  });

  it('return NONE for no user_id passed in at all', (done) => {
    req.setParams({ post_id: post_id1 });
    PostsController.fetchPostVotes(req, res, () => {
      const postVoteResponse = res.getJson();
      expect(postVoteResponse.vote).to.equal(POST_VOTE.NONE);
      done();
    });
  });

  it('return UPVOTE for an upvoted post', (done) => {
    req.setParams({ post_id: post_id2, user_id: user_id });
    PostsController.fetchPostVotes(req, res, () => {
      const postVoteResponse = res.getJson();
      expect(postVoteResponse.vote).to.equal(POST_VOTE.UPVOTE);
      done();
    });
  });

  it('return DOWNVOTE for a downvoted post', (done) => {
    req.setParams({ post_id: post_id1, user_id: user_id });
    PostsController.fetchPostVotes(req, res, () => {
      const postVoteResponse = res.getJson();
      expect(postVoteResponse.vote).to.equal(POST_VOTE.DOWNVOTE);
      done();
    });
  });

  it('return NONE for no post_id', (done) => {
    req.setParams({ user_id: user_id });
    PostsController.fetchPostVotes(req, res, () => {
      const postVoteResponse = res.getJson();
      expect(postVoteResponse.vote).to.equal(POST_VOTE.NONE);
      done();
    });
  });

  after(function after(done) {  // eslint-disable-line prefer-arrow-callback
    dropTestDB(done);
  });
});
