/* eslint-disable no-unused-expressions */

import chai from 'chai';
import mongoose from 'mongoose';
import AccountsController from '../../controllers/accounts.controller';
import AccountModel from '../../models/account';
import CaptainModel from '../../models/captain';
import UserModel from '../../models/user';
import RequestMock from '../mocks/request.mock';
import ResponseMock from '../mocks/response.mock';
import { getErrorMessage } from '../../../errors/error_handler';
import ERROR_CODES from '../../../constants/error_codes';
import { connectToTestDB, dropTestDB } from '../test_utils';
require('../../models/captain');

const expect = chai.expect;

const valid_friend_id = 2.34 * 1e8;
const valid_pirate_level = 12;
const valid_region = 'global';
const valid_account_add_request = { friend_id: valid_friend_id, pirate_level: valid_pirate_level, region: valid_region };

describe('AccountsController when logged out', () => {
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

  it('should redirect to /signup for .add', (done) => {
    AccountsController.add(req, res, expectRedirect(done));
  });

  it('should redirect to /signup for .delete', (done) => {
    AccountsController.delete(req, res, expectRedirect(done));
  });

  it('should redirect to /signup for .redirect', (done) => {
    AccountsController.redirect(req, res, expectRedirect(done));
  });
});

describe('AccountsController.redirect', () => {
  const req = new RequestMock();
  const username = 'test-username';
  req.login({ username });
  const res = new ResponseMock();

  it('should redirect to the account of the logged in user', (done) => {
    AccountsController.redirect(req, res, () => {
      expect(res.getRedirectPath()).to.equal(`/account/${username}`);
      done();
    });
  });
});

function expectCaptainsEqual(actual_captain, expected_captain) {
  // expect(actual_captain).to.equal(expected_captain);
  expect(actual_captain.current_level).to.equal(expected_captain.current_level);
  expect(actual_captain.current_special_level).to.equal(expected_captain.current_special_level);
  expect(actual_captain.current_hp_ccs).to.equal(expected_captain.current_hp_ccs);
  expect(actual_captain.current_atk_ccs).to.equal(expected_captain.current_atk_ccs);
  expect(actual_captain.current_rcv_ccs).to.equal(expected_captain.current_rcv_ccs);
  expect(actual_captain._unit.toString().valueOf()).to.equal(expected_captain._unit.toString().valueOf());
  expect(actual_captain._user.toString().valueOf()).to.equal(expected_captain._user.toString().valueOf());
  expect(actual_captain.current_sockets).to.have.lengthOf(expected_captain.current_sockets.length);
  for (const i in expected_captain.current_sockets) {  // eslint-disable-line guard-for-in
    const actual_socket = actual_captain.current_sockets[i];
    const expected_socket = expected_captain.current_sockets[i];

    expect(actual_socket._socket).to.equal(expected_socket._socket);
    expect(actual_socket.socket_level).to.equal(expected_socket.socket_level);
  }
}

function expectAccountsEqual(actual_account, expected_account) {
  expect(actual_account.region).to.equal(expected_account.region);
  expect(actual_account.crew_name).to.equal(expected_account.crew_name);
  expect(actual_account.friend_id).to.equal(expected_account.friend_id);
  expect(actual_account.pirate_level).to.equal(expected_account.pirate_level);
  const num_captains = expected_account._captains ? expected_account._captains.length : 0;
  expect(actual_account._captains).to.have.lengthOf(num_captains);
}

describe('AccountsController.add account validation', () => {
  const req = new RequestMock();
  req.login({});
  const res = new ResponseMock();

  const expectRedirectWithMessage = function expectRedirectWithMessage(done, message) {
    return function expectRedirectCB(cb, msg) {
      expect(req.getFlash('error_message')).to.equal(msg);
      expect(res.getRedirectPath()).to.equal('/account');
      cb();
    }.bind(this, done, message);
  };

  it('should reject empty accounts', (done) => {
    req.setBody({});
    AccountsController.add(req, res, expectRedirectWithMessage(done, 'Empty fields are not allowed.'));
  });

  it('should reject empty friend ids', (done) => {
    req.setBody({ region: valid_region, pirate_level: valid_pirate_level });
    AccountsController.add(req, res, expectRedirectWithMessage(done, 'Empty fields are not allowed.'));
  });

  it('should reject empty regions', (done) => {
    req.setBody({ friend_id: valid_friend_id, pirate_level: valid_pirate_level });
    AccountsController.add(req, res, expectRedirectWithMessage(done, 'Empty fields are not allowed.'));
  });

  it('should reject empty pirate levels', (done) => {
    req.setBody({ friend_id: valid_friend_id, region: valid_region });
    AccountsController.add(req, res, expectRedirectWithMessage(done, 'Empty fields are not allowed.'));
  });

  it('should reject < 1e8 friend ids', (done) => {
    req.setBody({ friend_id: 1e8 - 1, pirate_level: valid_pirate_level, region: valid_region });
    AccountsController.add(req, res, expectRedirectWithMessage(done, 'Invalid friend ID.'));
  });

  it('should reject >= 1e9 friend ids', (done) => {
    req.setBody({ friend_id: 1e9, pirate_level: valid_pirate_level, region: valid_region });
    AccountsController.add(req, res, expectRedirectWithMessage(done, 'Invalid friend ID.'));
  });

  it('should reject bad regions', (done) => {
    req.setBody({ friend_id: valid_friend_id, pirate_level: valid_pirate_level, region: 'invalid' });
    AccountsController.add(req, res, expectRedirectWithMessage(done, 'Invalid region.'));
  });

  it('should reject negative pirate levels', (done) => {
    req.setBody({ friend_id: valid_friend_id, pirate_level: -1, region: valid_region });
    AccountsController.add(req, res, expectRedirectWithMessage(done, 'Pirate level must be > 0.'));
  });
});

describe('AccountsController db tests', () => {
  const user_id = new mongoose.Types.ObjectId();
  const captain0 = {
    _id: new mongoose.Types.ObjectId(),
    current_level: 10,
    current_sockets: [{ _socket: 1, socket_level: 2 }],
    current_special_level: 11,
    current_hp_ccs: 12,
    current_atk_ccs: 13,
    current_rcv_ccs: 14,
    _unit: 15,
    _user: user_id,
  };
  const captain1 = {
    _id: new mongoose.Types.ObjectId(),
    current_level: 99,
    current_sockets: [],
    current_special_level: 1,
    current_hp_ccs: 100,
    current_atk_ccs: 99,
    current_rcv_ccs: 1,
    _unit: 17,
    _user: user_id,
  };
  const account0 = {
    _id: new mongoose.Types.ObjectId(),
    region: 'global',
    crew_name: 'testcrew0',
    friend_id: 100000000,
    pirate_level: 7,
    _captains: [],
  };
  const account1 = {
    _id: new mongoose.Types.ObjectId(),
    region: 'japan',
    crew_name: 'testcrew1',
    friend_id: 999999999,
    pirate_level: 7,
    _captains: [captain0._id, captain1._id],
  };

  const display_name = 'AccountsControllerGetUser';
  const username = 'accountscontrollergetuser';
  const password = 'pass';
  const salt = 'salt';
  const user = {
    _id: user_id,
    username,
    display_name,
    password,
    salt,
    _accounts: [account0._id, account1._id],
  };
  const req = new RequestMock();
  const res = new ResponseMock();

  beforeEach('Store a user', function beforeEach(done) {  // eslint-disable-line prefer-arrow-callback
    connectToTestDB(() => {
      const db_user = new UserModel(user);
      const db_account0 = new AccountModel(account0);
      const db_account1 = new AccountModel(account1);
      const db_captain0 = new CaptainModel(captain0);
      const db_captain1 = new CaptainModel(captain1);
      db_user.save((e0) => {
        if (e0) throw e0;
        db_captain0.save((e1) => {
          if (e1) throw e1;
          db_captain1.save((e2) => {
            if (e2) throw e2;
            db_account0.save((e3) => {
              if (e3) throw e3;
              db_account1.save((e4) => {
                if (e4) throw e4;
                done();
              });
            });
          });
        });
      });
    });
  });

  afterEach(function afterEach(done) {  // eslint-disable-line prefer-arrow-callback
    dropTestDB(done);
  });

  // Expects that the provided user has not changed from when it was set in beforeEach.
  // The user should have accounts and captains populated.
  function expectPopulatedUserUnchanged(populated_user) {
    expect(populated_user.username).to.equal(username);
    expect(populated_user.display_name).to.equal(display_name);
    expect(populated_user._accounts).to.have.lengthOf(2);
    // Accounts should be populated.
    expectAccountsEqual(populated_user._accounts[0], account0);
    expectAccountsEqual(populated_user._accounts[1], account1);
    // Captains should be populated.
    expectCaptainsEqual(populated_user._accounts[1]._captains[0], captain0);
    expectCaptainsEqual(populated_user._accounts[1]._captains[1], captain1);
  }

  function expectDBUnchanged(cb) {
    UserModel
      .find({})
      .populate({ path: '_accounts',
                  populate: {
                    path: '_captains',
                    model: 'Captain' } })
      .exec((err, users) => {
        if (err) throw err;
        expect(users).to.have.lengthOf(1);
        expectPopulatedUserUnchanged(users[0]);
        expect(user.password).to.equal(password);
        expect(user.salt).to.equal(salt);
        cb();
      });
  }

  function expectProperJsonResponse(response) {
    const actual_returned_user = response.getJson();
    expectPopulatedUserUnchanged(actual_returned_user);
    // Sensitive data should be stripped.
    expect(actual_returned_user.password).to.equal('');
    expect(actual_returned_user.salt).to.equal('');
  }

  it('.get should return json of the user', (done) => {
    req.setParams({ username });
    AccountsController.get(req, res, () => {
      expectProperJsonResponse(res);
      done();
    });
  });

  it('.get should return json of the user, even with display name', (done) => {
    req.setParams({ username: display_name });
    AccountsController.get(req, res, () => {
      expectProperJsonResponse(res);
      done();
    });
  });

  it('.add should fail if user has an invalid id', (done) => {
    req.setBody(valid_account_add_request);
    req.login({ _id: 'invalid_id' });
    AccountsController.add(req, res, () => {
      expect(req.getFlash('error_message')).to.equal(
        getErrorMessage(ERROR_CODES.ACCOUNTS_ADD_ERROR_1));
      expect(res.getRedirectPath()).to.equal('/account');
      expectDBUnchanged(done);
    });
  });

  it('.add should fail if user was not found', (done) => {
    req.setBody(valid_account_add_request);
    req.login({ _id: new mongoose.Types.ObjectId() });
    AccountsController.add(req, res, () => {
      expect(req.getFlash('error_message')).to.equal(
        getErrorMessage(ERROR_CODES.ACCOUNTS_ADD_ERROR_2));
      expect(res.getRedirectPath()).to.equal('/signup');
      expectDBUnchanged(done);
    });
  });

  function expectAccountAdded(request, cb) {
    UserModel
      .find({})
      .populate({ path: '_accounts',
                  populate: {
                    path: '_captains',
                    model: 'Captain' } })
      .exec((err, users) => {
        if (err) throw err;
        expect(users).to.have.lengthOf(1);
        const result = users[0];
        expect(result._accounts).to.have.lengthOf(3);
        const new_account = result._accounts[2];
        expectAccountsEqual(new_account, request.body);
        cb();
      });
  }

  it('.add should add a new account', (done) => {
    req.login({ _id: user_id });
    req.setBody({
      ...valid_account_add_request,
      crew_name: 'new account',
    });
    AccountsController.add(req, res, () => {
      expectAccountAdded(req, done);
    });
  });

  it('.add should edit an existing account', (done) => {
    req.login({ _id: user_id });
    const crew_name = 'edited crew';
    req.setBody({
      // Edit account1
      account_id: account1._id,
      crew_name,
      friend_id: 123456789,
      pirate_level: 99,
      region: 'global',
    });
    const expected_edited_account = new AccountModel({
      _id: account1._id,
      crew_name,
      friend_id: 123456789,
      pirate_level: 99,
      region: 'global',
      _captains: [captain0._id, captain1._id],
    });

    AccountsController.add(req, res, () => {
      UserModel
        .find()
        .populate({ path: '_accounts',
                    populate: {
                      path: '_captains',
                      model: 'Captain' } })
        .exec((err, users) => {
          if (err) throw err;
          expect(users).to.have.lengthOf(1);
          const result = users[0];
          expect(result._accounts).to.have.lengthOf(2);
          const edited_account = result._accounts[1];

          expectAccountsEqual(edited_account, expected_edited_account);
          // Captains should be unchanged.
          expectCaptainsEqual(result._accounts[1]._captains[0], captain0);
          expectCaptainsEqual(result._accounts[1]._captains[1], captain1);
          done();
        });
    });
  });

  it('.delete should fail if user has an invalid id', (done) => {
    req.login({ _id: 'invalid_id' });
    AccountsController.delete(req, res, () => {
      expect(req.getFlash('error_message')).to.equal(
        getErrorMessage(ERROR_CODES.ACCOUNTS_DELETE_ERROR_1));
      expect(res.getRedirectPath()).to.equal('/signup');
      expectDBUnchanged(done);
    });
  });

  it('.delete should fail if user was not found', (done) => {
    req.login({ _id: new mongoose.Types.ObjectId() });
    AccountsController.delete(req, res, () => {
      expect(req.getFlash('error_message')).to.equal(
        getErrorMessage(ERROR_CODES.ACCOUNTS_DELETE_ERROR_2));
      expect(res.getRedirectPath()).to.equal('/signup');
      expectDBUnchanged(done);
    });
  });

  it('.delete should delete the account and any captains associated with it', (done) => {
    req.login({ _id: user_id });
    req.setParams({ id: account1._id });
    AccountsController.delete(req, res, () => {
      UserModel
        .find()
        .populate({ path: '_accounts',
                    populate: {
                      path: '_captains',
                      model: 'Captain' } })
        .exec((err, users) => {
          if (err) throw err;
          // Account reference should be removed from the user.
          expect(users).to.have.lengthOf(1);
          const result = users[0];
          expect(result._accounts).to.have.lengthOf(1);
          // First account should be unchanged.
          expectAccountsEqual(result._accounts[0], account0);
          // Account should be deleted.
          AccountModel.findById(account1._id).exec((acct_err, acct) => {
            if (acct_err) throw acct_err;
            expect(acct).to.not.exist;
            // Captains in that account should be deleted.
            CaptainModel.findById(captain0._id).exec((c0_err, c0) => {
              if (c0_err) throw c0_err;
              expect(c0).to.not.exist;
              CaptainModel.findById(captain1._id).exec((c1_err, c1) => {
                if (c1_err) throw c1_err;
                expect(c1).to.not.exist;
                done();
              });
            });
          });
        });
    });
  });
});

/*
describe('AccountsController.add cotton candy validation tests', function () {
  var req,
    res;

  beforeEach('fake a response and a request with a logged in user', function beforeEach(done) {
    req = new RequestMock();
    // Make a fake user login.
    req.login({});
    res = new ResponseMock();
    done();
  });

  it('should reject > 100 hp CCs and redirect to /account', function (done) {
    req.setBody({
      current_hp_ccs: 101
    });
    CaptainsController.add(req, res, empty_next);
    expect(req.getFlash('error_message')).to.equal('You can only have at most 100 cotton candies per stat.');
    expect(res.getRedirectPath()).to.equal('/account');
    done();
  });

  it('should reject > 100 atk CCs and redirect to /account', function (done) {
    req.setBody({
      current_atk_ccs: 101
    });
    CaptainsController.add(req, res, empty_next);
    expect(req.getFlash('error_message')).to.equal('You can only have at most 100 cotton candies per stat.');
    expect(res.getRedirectPath()).to.equal('/account');
    done();
  });

  it('should reject > 100 rcv CCs and redirect to /account', function (done) {
    req.setBody({
      current_rcv_ccs: 101
    });
    CaptainsController.add(req, res, empty_next);
    expect(req.getFlash('error_message')).to.equal('You can only have at most 100 cotton candies per stat.');
    expect(res.getRedirectPath()).to.equal('/account');
    done();
  });

  it('should reject > 200 CCs (in one stat) and redirect to /account', function (done) {
    req.setBody({
      current_rcv_ccs: 201
    });
    CaptainsController.add(req, res, empty_next);
    expect(req.getFlash('error_message')).to.equal('You can only have at most 200 cotton candies per unit.');
    expect(res.getRedirectPath()).to.equal('/account');
    done();
  });

  it('should reject > 200 CCs (across stats) and redirect to /account', function (done) {
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
  if (captain.current_sockets.length === 1) {
    var socket = captain.current_sockets[0];
    return {
      socket_types: socket._socket,
      socket_levels: socket.socket_level
    };
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
    account_id: account_id.toString(),
    current_level: captain.current_level,
    current_special_level: captain.current_special_level,
    unit_id: captain._unit,
    current_hp_ccs: captain.current_hp_ccs,
    current_atk_ccs: captain.current_atk_ccs,
    current_rcv_ccs: captain.current_rcv_ccs,
    socket_types: socket_data.socket_types,
    socket_levels: socket_data.socket_levels,
    captain_id: captain._id.toString(),
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
    account_id: account_id.toString(),
    captain_id: captain_id.toString(),
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
  CaptainModel.findById(expected_captain._id, (err, captain) => {
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
  for (const account of user._accounts) {
    if (account._id.toString().valueOf() === account_id.toString().valueOf()) {
      return account;
    }
  }
  return null;
}

function expectCaptainAdded(account_id, expected_captain, callback) {
  UserModel.findById(expected_captain._user)
  .populate('_accounts')
  .exec((err, user) => {
    if (err) throw err;
    expect(user).to.exist;
    // User expectations
    // Num accounts should not have changed.
    expect(user._accounts).to.have.lengthOf(2);
    // Captain reference should be updated in account.
    const account = getAccount(account_id, user);
    expect(account._captains).to.contain(expected_captain._id);
    expectCaptainStored(expected_captain, callback);
  });
}

function expectCaptainDeleted(account_id, deleted_captain, delete_captain_callback) {
  UserModel.findById(deleted_captain._user)
  .populate('_accounts')
  .exec((err, user) => {
    if (err) throw err;
    expect(user).to.exist;
    // User expectations
    // Num accounts should not have changed.
    expect(user._accounts).to.have.lengthOf(2);
    // Captain reference should not be in the account anymore.
    const account = getAccount(account_id, user);
    expect(account._captains).to.not.contain(deleted_captain._id);
    // Look for the deleted captain.
    CaptainModel.findById(deleted_captain._id, (err1, captain) => {
      if (err1) throw err1;
      // We shouldn't find the deleted captain.
      expect(captain).to.not.exist;
      delete_captain_callback();
    });
  });
}

describe('CaptainsController.add', () => {
  const user_id = new mongoose.Types.ObjectId();
  const account0_id = new mongoose.Types.ObjectId();
  const account1_id = new mongoose.Types.ObjectId();
  var req, res;

  beforeEach('Store a user', function beforeEach(done) {
    this.timeout(20 * 1e3);
    const user = new UserModel({
      _id: user_id,
      _accounts: [account0_id, account1_id],
    });
    // Setup fake user.
    req = new RequestMock();
    req.login({ _id: user_id });
    res = new ResponseMock();

    connectDB(() => {
      // Store the fake user into the DB.
      user.save((err) => {
        if (err) throw err;
        const account0 = new AccountModel({ _id: account0_id });
        account0.save((err0) => {
          if (err0) throw err0;
          const account1 = new AccountModel({ _id: account1_id });
          account1.save(done);
        });
      });
    });
  });

  afterEach(function afterEach(done) {
    this.timeout(20 * 1e3);
    dropDB(done);
  });

  it('should send an error message and redirect to /account if user id was invalid', (done) => {
    // Reset request.
    req = new RequestMock();
    // Make a fake user login, with an invalid id.
    req.login({ _id: 'invalid_id' });
    req.setBody({ account_id: 'invalid_id' });

    CaptainsController.add(req, res, () => {
      expect(req.getFlash('error_message')).to.equal(
        getErrorMessage(ERROR_CODES.CAPTAINS_ADD_ERROR_1));
      expect(res.getRedirectPath()).to.equal('/account');
      done();
    });
  });

  it('should send an error message and redirect to /account if requested account was not found', (done) => {
    // Account id 1 doesn't exist.
    req.setBody({
      account_id: 'invalidobjectid',
    });

    CaptainsController.add(req, res, () => {
      expect(req.getFlash('error_message')).to.equal(
        getErrorMessage(ERROR_CODES.CAPTAINS_ADD_ERROR_1));
      expect(res.getRedirectPath()).to.equal('/account');
      done();
    });
  });

  it('should add a captain with no sockets', (done) => {
    const expected_captain = new CaptainModel({
      current_level: 10,
      current_special_level: 9,
      _unit: 98,
      _user: user_id,
      current_hp_ccs: 90,
      current_atk_ccs: 10,
      current_rcv_ccs: 80,
      current_sockets: [],
    });
    const callback = () => {
      // Req/res expectations.
      expect(req.getFlash('info_message')).to.equal('Captain added.');
      expect(res.getRedirectPath()).to.equal('/account');
      done();
    };
    addCaptain(account1_id, expected_captain, req, res, () => {
      expectCaptainAdded(account1_id, expected_captain, callback);
    });
  });

  it('should add a captain with one socket', (done) => {
    const socket = {
      _socket: 2,
      socket_level: 3,
    };
    const expected_captain = new CaptainModel({
      current_level: 10,
      current_special_level: 9,
      _unit: 98,
      _user: user_id,
      current_hp_ccs: 90,
      current_atk_ccs: 10,
      current_rcv_ccs: 80,
      current_sockets: [socket],
    });
    const callback = () => {
      // Req/res expectations.
      expect(req.getFlash('info_message')).to.equal('Captain added.');
      expect(res.getRedirectPath()).to.equal('/account');
      done();
    };
    addCaptain(account0_id, expected_captain, req, res, () => {
      expectCaptainAdded(account0_id, expected_captain, callback);
    });
  });

  it('should add a captain with many sockets', (done) => {
    const socket0 = {
      _socket: 2,
      socket_level: 3,
    };
    const socket1 = {
      _socket: 3,
      socket_level: 2,
    };
    const socket2 = {
      _socket: 6,
      socket_level: 5,
    };
    const expected_captain = new CaptainModel({
      current_level: 10,
      current_special_level: 9,
      _unit: 98,
      _user: user_id,
      current_hp_ccs: 90,
      current_atk_ccs: 10,
      current_rcv_ccs: 80,
      current_sockets: [socket0, socket1, socket2],
    });
    var callback = function () {
      // Req/res expectations.
      expect(req.getFlash('info_message')).to.equal('Captain added.');
      expect(res.getRedirectPath()).to.equal('/account');
      done();
    };
    addCaptain(account0_id, expected_captain, req, res, function () {
      expectCaptainAdded(account0_id, expected_captain, callback);
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
      current_sockets: [],
    });
    const socket0 = {
      _socket: 2,
      socket_level: 3,
    };
    const socket1 = {
      _socket: 3,
      socket_level: 2,
    };
    const socket2 = {
      _socket: 6,
      socket_level: 5,
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
      current_sockets: [socket0, socket1, socket2],
    });
    var add_captain_callback = function () {
      var edit_captain_callback = function () {
        // Req/res expectations.
        expect(req.getFlash('info_message')).to.equal('Captain edited.');
        expect(res.getRedirectPath()).to.equal('/account');
        done();
      };
      editCaptain(account1_id, expected_captain_after, req, res, function () {
        expectCaptainAdded(account1_id, expected_captain_after, edit_captain_callback);
      });
    };
    addCaptain(account1_id, expected_captain_before, req, res, add_captain_callback);
  });
});

describe('CaptainsController.delete', function () {
  const user_id = new mongoose.Types.ObjectId();
  const account0_id = new mongoose.Types.ObjectId();
  const account1_id = new mongoose.Types.ObjectId();
  var req, res;
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

  beforeEach('Store a user and a captain', function beforeEach(done) {
    this.timeout(20 * 1e3);
    const user = new UserModel({
      _id: user_id,
      _accounts: [account0_id, account1_id],
    });
      // Setup fake user.
    req = new RequestMock();
    req.login(user);
    res = new ResponseMock();

    connectDB(() => {
      // Store the fake user into the DB.
      user.save((err) => {
        if (err) throw err;
        const account0 = new AccountModel({ _id: account0_id });
        account0.save((err0) => {
          if (err0) throw err0;
          const account1 = new AccountModel({ _id: account1_id });
          account1.save((err1) => {
            if (err1) throw err1;
            addCaptain(account1_id, captain, req, res, done);
          });
        });
      });
    });
  });

  afterEach(function afterEach(done) {
    dropDB(done);
  });

  it('should fail if the wrong user was deleting a captain', (done) => {
    // Reset request.
    req = new RequestMock();
    // Make a fake user login, with a different id from the one that was stored in the DB.
    req.login({
      _id: new mongoose.Types.ObjectId(),
      _accounts: [new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId()],
    });

    const delete_captain_callback = () => {
      // Should fail and redirect to account.
      expect(req.getFlash('error_message')).to.equal(getErrorMessage(ERROR_CODES.CAPTAINS_DELETE_ERROR_4));
      expect(res.getRedirectPath()).to.equal('/account');
      done();
    };
    deleteCaptain(account1_id, captain._id, req, res, () => {
      // The captain should still be there, because the deletion should've failed.
      expectCaptainAdded(account1_id, captain, delete_captain_callback);
    });
  });

  it('should fail if account was not found when deleting a captain', (done) => {
    const delete_captain_callback = () => {
      // Should fail and redirect to account.
      // This is the same error as above, because a wrong account would not be associated with the current user.
      expect(req.getFlash('error_message')).to.equal(getErrorMessage(ERROR_CODES.CAPTAINS_DELETE_ERROR_4));
      expect(res.getRedirectPath()).to.equal('/account');
      done();
    };
    const wrong_account = new mongoose.Types.ObjectId();
    deleteCaptain(wrong_account, captain._id, req, res, () => {
      // The captain should still be there, because the deletion should've failed.
      expectCaptainAdded(account1_id, captain, delete_captain_callback);
    });
  });

  it('should not delete a captain if the user is logged out', (done) => {
    req.logout();
    const delete_captain_callback = () => {
      // Should fail and redirect to signup.
      expect(req.getFlash('error_message')).to.equal('Please sign in.');
      expect(res.getRedirectPath()).to.equal('/signup');
      done();
    };
    deleteCaptain(account1_id, captain._id, req, res, () => {
      // The captain should still be there, because the deletion should've failed.
      expectCaptainAdded(account1_id, captain, delete_captain_callback);
    });
  });

  it('should delete a captain', (done) => {
    const delete_captain_callback = () => {
      // Req/res expectations.
      expect(req.getFlash('info_message')).to.equal('Captain deleted.');
      expect(res.getRedirectPath()).to.equal('/account');
      done();
    };
    deleteCaptain(account1_id, captain._id, req, res, () => {
      expectCaptainDeleted(account1_id, captain, delete_captain_callback);
    });
  });
});
*/
