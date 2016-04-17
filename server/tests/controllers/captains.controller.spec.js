/* eslint-disable */

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
import mongoConfig from '../../config';

const expect = chai.expect;

function connectDB(done) {
  mongoose.connect(mongoConfig.mongoURL, function (err) {
    if (err) return done(err);
    done();
  });
}

function dropDB(done) {
  if (mongoose.connection.name !== 'optc-test') {
    return done();
  }

  mongoose.connection.db.dropDatabase(function (err) {
    if (err) throw err;
    mongoose.connection.close(done);
  });
}

var empty_next = function() {};

describe('captains.add logged out failure', function () {
  it('should reject logged out users and redirect to /signup', function (done) {
    // Req has no user to simulate user being logged out.
    var req = new RequestMock();
    var res = new ResponseMock();
    CaptainsController.add(req, res, empty_next);
    expect(req.getFlash('error_message')).to.equal('Please sign in.');
    expect(res.getRedirectPath()).to.equal('/signup');
    done();
  });
});

describe('captains.add cotton candy validation tests', function () {
  var req, res;
  
  beforeEach('fake a response and a request with a logged in user', function (done) {
    req = new RequestMock();
    // Make a fake user login.
    req.login({});
    res = new ResponseMock();
    done();
  });
  
  it('should reject > 100 hp CCs and redirect to /account', function (done) {
    req.setBody({ current_hp_ccs: 101 });
    CaptainsController.add(req, res, empty_next);
    expect(req.getFlash('error_message')).to.equal('You can only have at most 100 cotton candies per stat.');
    expect(res.getRedirectPath()).to.equal('/account');
    done();
  });
  
  it('should reject > 100 atk CCs and redirect to /account', function (done) {
    req.setBody({ current_atk_ccs: 101 });
    CaptainsController.add(req, res, empty_next);
    expect(req.getFlash('error_message')).to.equal('You can only have at most 100 cotton candies per stat.');
    expect(res.getRedirectPath()).to.equal('/account');
    done();
  });
  
  it('should reject > 100 rcv CCs and redirect to /account', function (done) {
    req.setBody({ current_rcv_ccs: 101 });
    CaptainsController.add(req, res, empty_next);
    expect(req.getFlash('error_message')).to.equal('You can only have at most 100 cotton candies per stat.');
    expect(res.getRedirectPath()).to.equal('/account');
    done();
  });
  
  it('should reject > 200 CCs (in one stat) and redirect to /account', function (done) {
    req.setBody({ current_rcv_ccs: 201 });
    CaptainsController.add(req, res, empty_next);
    expect(req.getFlash('error_message')).to.equal('You can only have at most 200 cotton candies per unit.');
    expect(res.getRedirectPath()).to.equal('/account');
    done();
  });
  
  it('should reject > 200 CCs (across stats) and redirect to /account', function (done) {
    req.setBody({ current_hp_ccs: 100, current_atk_ccs: 100, current_rcv_ccs: 1 });
    CaptainsController.add(req, res, empty_next);
    expect(req.getFlash('error_message')).to.equal('You can only have at most 200 cotton candies per unit.');
    expect(res.getRedirectPath()).to.equal('/account');
    done();
  });
});

// Returns a map of socket types and levels for the given captain.
function getSocketData(captain) {
  var socket_types = [];
  var socket_levels = [];
  captain.current_sockets.map((socket) => {
    socket_types.push(socket._socket);
    socket_levels.push(socket.socket_level);
  });
  return { socket_types: socket_types, socket_levels: socket_levels };
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

// Returns a list of sockets (without the random mongodb document fields).
function getSimpleSockets(captain) {
  var sockets = [];
  captain.current_sockets.map((socket) => {
    sockets.push({ _socket: socket._socket, socket_level: socket.socket_level });
  });
  return sockets;
}

function expectCaptainStored(expected_captain, callback) {
  // Look for captain.
  CaptainModel.findById(expected_captain._id, function(err, captain) {
    if (err) throw err;
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
    if (account_id == account.id) result = account;
  });
  return result;
}

function expectCaptainProperlyAdded(account_id, expected_captain, callback) {
  UserModel.findById(expected_captain._user, function (err, user) {
    if (err) throw err;
    // User expectations
    // Num accounts should not have changed.
    expect(user.accounts).to.have.lengthOf(2);
    // Captain reference should be updated in account.
    const account = getAccount(account_id, user);
    expect(account._captains).to.contain(expected_captain._id);
    expectCaptainStored(expected_captain, callback);
  });
}

describe('captains.add db tests', function () {
  const user_id = mongoose.Types.ObjectId();
  const account0_id = 12;
  const account1_id = 56;
  var req, res;
  
  beforeEach('Store a user', function (done) {
    this.timeout(10 * 1e3);
    const account0 = {id: account0_id};
    const account1 = {id: account1_id};
    const user = new UserModel({
      _id: user_id,
      accounts: [
        account0,
        account1
      ]
    });
    connectDB(function () {
      // Setup fake user.
      req = new RequestMock();
      req.login({ _id: user_id });
      req.setBody({ account_id: 1 });
      res = new ResponseMock();
      
      // Store the fake user into the DB.
      user.save(function(err) {
        if (err) throw err;
        done();
      });
    });
  });

  afterEach(function (done) {
    this.timeout(10 * 1e3);
    dropDB(done);
  });
  
  it('should send an error message and redirect to /account if user id was invalid', function (done) {
    // Reset request.
    req = new RequestMock();
    // Make a fake user login, with an invalid id.
    req.login({ _id: "invalid_id" });
    req.setBody({ account_id: 1 });
    
    CaptainsController.add(req, res, function () {
      expect(req.getFlash('error_message')).to.equal(getErrorMessage(0));
      expect(res.getRedirectPath()).to.equal('/account');
      done();    
    });
  });
  
  it('should send an error message and redirect to /signup if user was not found', function (done) {
    // Reset request.
    req = new RequestMock();
    // Make a fake user login, with a different id from the one that was stored in the DB.
    req.login({ _id: mongoose.Types.ObjectId() });
    req.setBody({ account_id: 1 });
    
    CaptainsController.add(req, res, function () {
      expect(req.getFlash('error_message')).to.equal('Please sign in.');
      expect(res.getRedirectPath()).to.equal('/signup');
      done();    
    });
  });
  
  it('should send an error message and redirect to /account if requested account was not found', function (done) {
    // Account id 1 doesn't exist.
    req.setBody({ account_id: 1 });
    
    CaptainsController.add(req, res, function () {
      expect(req.getFlash('error_message')).to.equal(getErrorMessage(1));
      expect(res.getRedirectPath()).to.equal('/account');
      done();    
    });
  });
  
  it('should add a captain with no sockets', function (done) {
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
    var callback = function () {
      // Req/res expectations.
      expect(req.getFlash('info_message')).to.equal('Captain added.');
      expect(res.getRedirectPath()).to.equal('/account');
      done();
    }
    addCaptain(account1_id, expected_captain, req, res, function () {
      expectCaptainProperlyAdded(account1_id, expected_captain, callback);
    });
  });
  
  it('should add a captain with one socket', function (done) {
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
      current_sockets: [ socket ]
    });
    var callback = function () {
      // Req/res expectations.
      expect(req.getFlash('info_message')).to.equal('Captain added.');
      expect(res.getRedirectPath()).to.equal('/account');
      done();
    }
    addCaptain(account0_id, expected_captain, req, res, function () {
      expectCaptainProperlyAdded(account0_id, expected_captain, callback);
    });
  });
  
  it('should add a captain with many sockets', function (done) {
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
      current_sockets: [ socket0, socket1, socket2 ]
    });
    var callback = function () {
      // Req/res expectations.
      expect(req.getFlash('info_message')).to.equal('Captain added.');
      expect(res.getRedirectPath()).to.equal('/account');
      done();
    }
    addCaptain(account0_id, expected_captain, req, res, function () {
      expectCaptainProperlyAdded(account0_id, expected_captain, callback);
    });
  });
  
  it('should edit a captain', function (done) {
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
      current_sockets: [ socket0, socket1, socket2 ]
    });
    var add_captain_callback = function() {
      var edit_captain_callback = function () {
        // Req/res expectations.
        expect(req.getFlash('info_message')).to.equal('Captain edited.');
        expect(res.getRedirectPath()).to.equal('/account');
        done();
      }
      editCaptain(account1_id, expected_captain_after, req, res, function () {
        expectCaptainProperlyAdded(account1_id, expected_captain_after, edit_captain_callback);
      });
    };
    addCaptain(account1_id, expected_captain_before, req, res, add_captain_callback);
  });
});