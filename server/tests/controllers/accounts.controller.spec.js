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
    region: 'global',
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
    region: 'global',
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
