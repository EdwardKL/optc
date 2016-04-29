import mocha from 'mocha';
import chai from 'chai';
import request from 'supertest';
import mongoose from 'mongoose';
import CaptainsController from '../../controllers/captains.controller';
import CaptainModel from '../../models/captain';
import UserModel from '../../models/user';
import RequestMock from '../mocks/request.mock';
import ResponseMock from '../mocks/response.mock';
import { getErrorMessage } from '../../../errors/error_handler';
import ERROR_CODES from '../../../constants/error_codes';
import mongoConfig from '../../config';

const expect = chai.expect;

function connectDB(done) {
  mongoose.connect(mongoConfig.mongoURL, function(err) {
    if (err) return done(err);
    done();
  });
}

function dropDB(done) {
  if (mongoose.connection.name !== 'optc-test') {
    return done();
  }

  mongoose.connection.db.dropDatabase(function(err) {
    if (err)
      throw err;
    mongoose.connection.close(done);
  });
}

var empty_next = function() {};

describe('captains.add logged out failure', function() {
  it('should reject logged out users and redirect to /signup', function(done) {
    // Req has no user to simulate user being logged out.
    var req = new RequestMock();
    var res = new ResponseMock();
    CaptainsController.add(req, res, empty_next);
    expect(req.getFlash('error_message')).to.equal('Please sign in.');
    expect(res.getRedirectPath()).to.equal('/signup');
    done();
  });
});

describe('captains.add cotton candy validation tests', function() {
  var req,
    res;

  beforeEach('fake a response and a request with a logged in user', function(done) {
    req = new RequestMock();
    // Make a fake user login.
    req.login({});
    res = new ResponseMock();
    done();
  });

  it('should reject > 100 hp CCs and redirect to /account', function(done) {
    req.setBody({
      current_hp_ccs: 101
    });
    CaptainsController.add(req, res, empty_next);
    expect(req.getFlash('error_message')).to.equal('You can only have at most 100 cotton candies per stat.');
    expect(res.getRedirectPath()).to.equal('/account');
    done();
  });

  it('should reject > 100 atk CCs and redirect to /account', function(done) {
    req.setBody({
      current_atk_ccs: 101
    });
    CaptainsController.add(req, res, empty_next);
    expect(req.getFlash('error_message')).to.equal('You can only have at most 100 cotton candies per stat.');
    expect(res.getRedirectPath()).to.equal('/account');
    done();
  });

  it('should reject > 100 rcv CCs and redirect to /account', function(done) {
    req.setBody({
      current_rcv_ccs: 101
    });
    CaptainsController.add(req, res, empty_next);
    expect(req.getFlash('error_message')).to.equal('You can only have at most 100 cotton candies per stat.');
    expect(res.getRedirectPath()).to.equal('/account');
    done();
  });

  it('should reject > 200 CCs (in one stat) and redirect to /account', function(done) {
    req.setBody({
      current_rcv_ccs: 201
    });
    CaptainsController.add(req, res, empty_next);
    expect(req.getFlash('error_message')).to.equal('You can only have at most 200 cotton candies per unit.');
    expect(res.getRedirectPath()).to.equal('/account');
    done();
  });

  it('should reject > 200 CCs (across stats) and redirect to /account', function(done) {
    req.setBody({
      current_hp_ccs: 100,
      current_atk_ccs: 100,
      current_rcv_ccs: 1
    });
    CaptainsController.add(req, res, empty_next);
    expect(req.getFlash('error_message')).to.equal('You can only have at most 200 cotton candies per unit.');
    expect(res.getRedirectPath()).to.equal('/account');
    done();
  });
});

// Returns a map of socket types and levels for the given captain.
function getSocketData(captain) {
  if (captain.current_sockets.length == 1) {
    var socket = captain.current_sockets[0];
    return {
      socket_types: socket._socket,
      socket_levels: socket.socket_level
    }
  }
  var socket_types = [];
  var socket_levels = [];
  captain.current_sockets.map((socket) => {
    socket_types.push(socket._socket);
    socket_levels.push(socket.socket_level);
  });
  return {
    socket_types: socket_types,
    socket_levels: socket_levels
  };
}

// Returns the request body for the given captain.
function getRequestBodyForCaptain(account_id, captain) {
  const socket_data = getSocketData(captain);
  return {
    account_id: account_id,
    current_level: captain.current_level,
    current_special_level: captain.current_special_level,
    unit_id: captain._unit,
    current_hp_ccs: captain.current_hp_ccs,
    current_atk_ccs: captain.current_atk_ccs,
    current_rcv_ccs: captain.current_rcv_ccs,
    socket_types: socket_data.socket_types,
    socket_levels: socket_data.socket_levels,
    captain_id: captain._id
  };
}

function addCaptain(account_id, captain, request, result, callback) {
  request.setBody(getRequestBodyForCaptain(account_id, captain));
  CaptainsController.add(request, result, callback);
}

// Pretty much the same as addCaptain, but with captain_id as part of the request body.
function editCaptain(account_id, captain, request, result, callback) {
  var request_body = getRequestBodyForCaptain(account_id, captain);
  request_body.captain_id = captain._id;
  request.setBody(getRequestBodyForCaptain(account_id, captain));
  CaptainsController.add(request, result, callback);
}

// Deletes the captain specified by account_id and captain_id.
function deleteCaptain(account_id, captain_id, request, result, callback) {
  request.setParams({
    account_id: account_id,
    captain_id: captain_id
  });
  CaptainsController.delete(request, result, callback);
}

// Returns a list of sockets (without the random mongodb document fields).
function getSimpleSockets(captain) {
  var sockets = [];
  captain.current_sockets.map((socket) => {
    sockets.push({
      _socket: socket._socket,
      socket_level: socket.socket_level
    });
  });
  return sockets;
}

function expectCaptainStored(expected_captain, callback) {
  // Look for captain.
  CaptainModel.findById(expected_captain._id, function(err, captain) {
    if (err)
      throw err;
    expect(captain.current_level).to.equal(expected_captain.current_level);
    expect(captain.current_special_level).to.equal(expected_captain.current_special_level);
    expect(captain._unit).to.equal(expected_captain._unit);
    expect(captain.current_hp_ccs).to.equal(expected_captain.current_hp_ccs);
    expect(captain.current_atk_ccs).to.equal(expected_captain.current_atk_ccs);
    expect(captain.current_rcv_ccs).to.equal(expected_captain.current_rcv_ccs);
    expect(getSimpleSockets(captain)).to.deep.equal(getSimpleSockets(expected_captain));
    callback();
  });
}

function getAccount(account_id, user) {
  var result;
  user.accounts.map((account) => {
    if (account_id == account.id)
      result = account;
  });
  return result;
}

function expectCaptainAdded(account_id, expected_captain, callback) {
  UserModel.findById(expected_captain._user, function(err, user) {
    if (err)
      throw err;
    console.log("Looked for user with id: ", expected_captain._user);
    expect(user).to.exist;
    // User expectations
    // Num accounts should not have changed.
    expect(user.accounts).to.have.lengthOf(2);
    // Captain reference should be updated in account.
    const account = getAccount(account_id, user);
    expect(account._captains).to.contain(expected_captain._id);
    expectCaptainStored(expected_captain, callback);
  });
}

function expectCaptainDeleted(account_id, deleted_captain, delete_captain_callback) {
  UserModel.findById(deleted_captain._user, function(err, user) {
    if (err)
      throw err;
    // User expectations
    // Num accounts should not have changed.
    expect(user.accounts).to.have.lengthOf(2);
    // Captain reference should not be in the account anymore.
    const account = getAccount(account_id, user);
    expect(account._captains).to.not.contain(deleted_captain._id);
    // Look for the deleted captain.
    CaptainModel.findById(deleted_captain._id, function(err, captain) {
      if (err)
        throw err;
      // We shouldn't find the deleted captain.
      expect(captain).to.not.exist;
      console.log("find by id");
      delete_captain_callback();
    });
  });
}

describe('CaptainsController.add', function() {
  const user_id = mongoose.Types.ObjectId();
  const account0_id = 12;
  const account1_id = 56;
  var req,
    res;

  beforeEach('Store a user', function(done) {
    this.timeout(20 * 1e3);
    const account0 = {
      id: account0_id
    };
    const account1 = {
      id: account1_id
    };
    const user = new UserModel({
      _id: user_id,
      accounts: [
        account0,
        account1
      ]
    });
    // Setup fake user.
    req = new RequestMock();
    req.login({
      _id: user_id
    });
    console.log("logged in");
    req.setBody({
      account_id: 1
    });
    res = new ResponseMock();
    connectDB(function() {
      // Store the fake user into the DB.
      user.save(function(err) {
        if (err)
          throw err;
        console.log("stored user: ", user._id);
        done();
      });
    });
  });

  afterEach(function(done) {
    this.timeout(20 * 1e3);
    dropDB(done);
  });

  it('should send an error message and redirect to /account if user id was invalid', function(done) {
    // Reset request.
    req = new RequestMock();
    // Make a fake user login, with an invalid id.
    req.login({
      _id: "invalid_id"
    });
    req.setBody({
      account_id: 1
    });

    CaptainsController.add(req, res, function() {
      expect(req.getFlash('error_message')).to.equal(
        getErrorMessage(ERROR_CODES.CAPTAINS_ADD_ERROR_1));
      expect(res.getRedirectPath()).to.equal('/account');
      done();
    });
  });

  it('should send an error message and redirect to /signup if user was not found', function(done) {
    // Reset request.
    req = new RequestMock();
    // Make a fake user login, with a different id from the one that was stored in the DB.
    req.login({
      _id: mongoose.Types.ObjectId()
    });
    req.setBody({
      account_id: 1
    });

    CaptainsController.add(req, res, function() {
      expect(req.getFlash('error_message')).to.equal('Please sign in.');
      expect(res.getRedirectPath()).to.equal('/signup');
      done();
    });
  });

  it('should send an error message and redirect to /account if requested account was not found', function(done) {
    // Account id 1 doesn't exist.
    req.setBody({
      account_id: 1
    });

    CaptainsController.add(req, res, function() {
      expect(req.getFlash('error_message')).to.equal(
        getErrorMessage(ERROR_CODES.CAPTAINS_ADD_ERROR_2));
      expect(res.getRedirectPath()).to.equal('/account');
      done();
    });
  });

  it('should add a captain with no sockets', function(done) {
    const expected_captain = new CaptainModel({
      current_level: 10,
      current_special_level: 9,
      _unit: 98,
      _user: user_id,
      current_hp_ccs: 90,
      current_atk_ccs: 10,
      current_rcv_ccs: 80,
      current_sockets: []
    });
    var callback = function() {
      // Req/res expectations.
      expect(req.getFlash('info_message')).to.equal('Captain added.');
      expect(res.getRedirectPath()).to.equal('/account');
      done();
    }
    addCaptain(account1_id, expected_captain, req, res, function() {
      expectCaptainAdded(account1_id, expected_captain, callback);
    });
  });

  it('should add a captain with one socket', function(done) {
    const socket = {
      _socket: 2,
      socket_level: 3
    };
    const expected_captain = new CaptainModel({
      current_level: 10,
      current_special_level: 9,
      _unit: 98,
      _user: user_id,
      current_hp_ccs: 90,
      current_atk_ccs: 10,
      current_rcv_ccs: 80,
      current_sockets: [socket]
    });
    console.log("user id:", user_id);
    var callback = function() {
      // Req/res expectations.
      expect(req.getFlash('info_message')).to.equal('Captain added.');
      expect(res.getRedirectPath()).to.equal('/account');
      done();
    }
    addCaptain(account0_id, expected_captain, req, res, function() {
      expectCaptainAdded(account0_id, expected_captain, callback);
    });
  });

  it('should add a captain with many sockets', function(done) {
    const socket0 = {
      _socket: 2,
      socket_level: 3
    };
    const socket1 = {
      _socket: 3,
      socket_level: 2
    };
    const socket2 = {
      _socket: 6,
      socket_level: 5
    };
    const expected_captain = new CaptainModel({
      current_level: 10,
      current_special_level: 9,
      _unit: 98,
      _user: user_id,
      current_hp_ccs: 90,
      current_atk_ccs: 10,
      current_rcv_ccs: 80,
      current_sockets: [socket0, socket1, socket2]
    });
    var callback = function() {
      // Req/res expectations.
      expect(req.getFlash('info_message')).to.equal('Captain added.');
      expect(res.getRedirectPath()).to.equal('/account');
      done();
    }
    addCaptain(account0_id, expected_captain, req, res, function() {
      expectCaptainAdded(account0_id, expected_captain, callback);
    });
  });

  it('should edit a captain', function(done) {
    const expected_captain_before = new CaptainModel({
      current_level: 10,
      current_special_level: 9,
      _unit: 98,
      _user: user_id,
      current_hp_ccs: 90,
      current_atk_ccs: 10,
      current_rcv_ccs: 80,
      current_sockets: []
    });
    const socket0 = {
      _socket: 2,
      socket_level: 3
    };
    const socket1 = {
      _socket: 3,
      socket_level: 2
    };
    const socket2 = {
      _socket: 6,
      socket_level: 5
    };
    const expected_captain_after = new CaptainModel({
      // Add existing id to show that we're editing.
      _id: expected_captain_before._id,
      current_level: 90,
      current_special_level: 10,
      _unit: 94,
      _user: user_id,
      current_hp_ccs: 32,
      current_atk_ccs: 40,
      current_rcv_ccs: 0,
      current_sockets: [socket0, socket1, socket2]
    });
    var add_captain_callback = function() {
      var edit_captain_callback = function() {
        // Req/res expectations.
        expect(req.getFlash('info_message')).to.equal('Captain edited.');
        expect(res.getRedirectPath()).to.equal('/account');
        done();
      }
      editCaptain(account1_id, expected_captain_after, req, res, function() {
        expectCaptainAdded(account1_id, expected_captain_after, edit_captain_callback);
      });
    };
    addCaptain(account1_id, expected_captain_before, req, res, add_captain_callback);
  });
});

describe('CaptainsController.delete', function() {
  const user_id = mongoose.Types.ObjectId();
  const account0_id = 12;
  const account1_id = 56;
  var req,
    res;
  const socket = {
    _socket: 2,
    socket_level: 3
  };
  const captain = new CaptainModel({
    current_level: 10,
    current_special_level: 9,
    _unit: 98,
    _user: user_id,
    current_hp_ccs: 90,
    current_atk_ccs: 10,
    current_rcv_ccs: 80,
    current_sockets: [socket]
  });

  beforeEach('Store a user and a captain', function(done) {
    this.timeout(20 * 1e3);
    const account0 = {
      id: account0_id
    };
    const account1 = {
      id: account1_id
    };
    const user = new UserModel({
      _id: user_id,
      accounts: [
        account0,
        account1
      ]
    });

    connectDB(function() {
      // Store the fake user into the DB.
      user.save(function(err) {
        if (err)
          throw err;

        // Setup fake user.
        req = new RequestMock();
        req.login({
          _id: user_id
        });
        req.setBody({
          account_id: 1
        });
        res = new ResponseMock();
        addCaptain(account1_id, captain, req, res, done);
      });
    });
  });

  afterEach(function(done) {
    dropDB(done);
  });

  it('should fail if we have an error finding the user when deleting a captain', function(done) {
    // Reset request.
    req = new RequestMock();
    // Make a fake user login, with a different id from the one that was stored in the DB.
    req.login({
      _id: "some_invalid_id"
    });

    var delete_captain_callback = function() {
      // Should fail and redirect to account.
      expect(req.getFlash('error_message')).to.equal(getErrorMessage(ERROR_CODES.CAPTAINS_DELETE_ERROR_1));
      expect(res.getRedirectPath()).to.equal('/account');
      done();
    }
    deleteCaptain(account1_id, captain._id, req, res, function() {
      // The captain should still be there, because the deletion should've failed.
      expectCaptainAdded(account1_id, captain, delete_captain_callback);
    });
  });

  it('should fail if user was not found when deleting a captain', function(done) {
    // Reset request.
    req = new RequestMock();
    // Make a fake user login, with a different id from the one that was stored in the DB.
    req.login({
      _id: mongoose.Types.ObjectId()
    });
    req.setBody({
      account_id: 1
    });

    var delete_captain_callback = function() {
      // Should fail and redirect to account.
      expect(req.getFlash('error_message')).to.equal(getErrorMessage(ERROR_CODES.CAPTAINS_DELETE_ERROR_2));
      expect(res.getRedirectPath()).to.equal('/account');
      done();
    }
    deleteCaptain(account1_id, captain._id, req, res, function() {
      // The captain should still be there, because the deletion should've failed.
      expectCaptainAdded(account1_id, captain, delete_captain_callback);
    });
  });

  it('should fail if account was not found when deleting a captain', function(done) {
    var delete_captain_callback = function() {
      // Should fail and redirect to account.
      expect(req.getFlash('error_message')).to.equal(getErrorMessage(ERROR_CODES.CAPTAINS_DELETE_ERROR_3));
      expect(res.getRedirectPath()).to.equal('/account');
      done();
    }
    const wrong_account = account1_id + 10;
    deleteCaptain(wrong_account, captain._id, req, res, function() {
      // The captain should still be there, because the deletion should've failed.
      expectCaptainAdded(account1_id, captain, delete_captain_callback);
    });
  });

  it('should not delete a captain if the user is logged out', function(done) {
    req.logout();
    var delete_captain_callback = function() {
      // Should fail and redirect to signup.
      expect(req.getFlash('error_message')).to.equal('Please sign in.');
      expect(res.getRedirectPath()).to.equal('/signup');
      done();
    }
    deleteCaptain(account1_id, captain._id, req, res, function() {
      // The captain should still be there, because the deletion should've failed.
      expectCaptainAdded(account1_id, captain, delete_captain_callback);
    });
  });

  it('should delete a captain', function(done) {
    var delete_captain_callback = function() {
      // Req/res expectations.
      expect(req.getFlash('info_message')).to.equal('Captain deleted.');
      expect(res.getRedirectPath()).to.equal('/account');
      done();
    }
    deleteCaptain(account1_id, captain._id, req, res, function() {
      expectCaptainDeleted(account1_id, captain, delete_captain_callback);
    });
  });
});
