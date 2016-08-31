/* eslint-disable no-unused-expressions */

import chai from 'chai';
import mongoose from 'mongoose';
import UsersController from '../../controllers/users.controller';
import AccountModel from '../../models/account';
import CaptainModel from '../../models/captain';
import UserModel from '../../models/user';
import RequestMock from '../mocks/request.mock';
import ResponseMock from '../mocks/response.mock';
import { getErrorMessage } from '../../../errors/error_handler';
import ERROR_CODES from '../../../constants/error_codes';
import { connectToTestDB, dropTestDB } from '../test_utils';

const expect = chai.expect;

describe('UsersController when logged out', () => {
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

  it('should redirect to /signup for .setUser', (done) => {
    UsersController.setUser(req, res, expectRedirect(done));
  });

  it('should redirect to /signup for .editPass', (done) => {
    UsersController.editPass(req, res, expectRedirect(done));
  });

  it('should redirect to /signup for .delete', (done) => {
    UsersController.delete(req, res, expectRedirect(done));
  });
});

describe('UsersController.setUser validation', () => {
  const req = new RequestMock();
  const res = new ResponseMock();
  req.login({});

  const username_length_error = 'Usernames must be at least 2 characters long.';
  const username_invalid_error = 'Username contained invalid characters. Only alphanumeric, dash, and underscore characters are allowed.';

  const expectRedirectWithMessage = function expectRedirectWithMessage(done, message) {
    return function expectRedirectCB(cb, msg) {
      expect(req.getFlash('error_message')).to.equal(msg);
      expect(res.getRedirectPath()).to.equal('back');
      cb();
    }.bind(this, done, message);
  };

  it('should redirect if no username', (done) => {
    req.setBody({});
    UsersController.setUser(req, res, expectRedirectWithMessage(done, username_length_error));
  });

  it('should redirect if username was 1 char', (done) => {
    req.setBody({ username: 'a' });
    UsersController.setUser(req, res, expectRedirectWithMessage(done, username_length_error));
  });

  it('should redirect if username has special chars', (done) => {
    req.setBody({ username: 'test!' });
    UsersController.setUser(req, res, expectRedirectWithMessage(done, username_invalid_error));
  });
});

describe('UsersController.setUser', () => {
  const req = new RequestMock();
  const res = new ResponseMock();
  req.login({});
  const _id = new mongoose.Types.ObjectId();
  const username = 'test-user';

  beforeEach(function before(done) {  // eslint-disable-line prefer-arrow-callback
    connectToTestDB(() => {
      const db_user = new UserModel({ _id, username });
      db_user.save((err) => {
        if (err) throw err;
        done();
      });
    });
  });

  afterEach(function after(done) {  // eslint-disable-line prefer-arrow-callback
    dropTestDB(done);
  });

  it('should redirect if username exists', (done) => {
    req.setBody({ username });
    UsersController.setUser(req, res, () => {
      expect(req.getFlash('error_message')).to.equal('Username already exists.');
      expect(res.getRedirectPath()).to.equal('back');
      done();
    });
  });

  it("should be successful if username doesn't exist", (done) => {
    const unique_username = 'this-is-a-successful-username';
    req.login(new UserModel({ _id, username }));
    req.setBody({ username: unique_username });
    UsersController.setUser(req, res, () => {
      UserModel.findById(_id).exec((err, user) => {
        expect(user.username).to.equal(unique_username);
        expect(user.display_name).to.equal(unique_username);
        expect(req.getFlash('info_message')).to.equal('Username set.');
        expect(res.getRedirectPath()).to.equal('/');
        done();
      });
    });
  });

  it('should lowercase usernames', (done) => {
    const expected_username = 'thisisadisplayname';
    const display_name = 'ThisIsADisplayName';
    req.login(new UserModel({ _id, username }));
    req.setBody({ username: display_name });
    UsersController.setUser(req, res, () => {
      UserModel.findById(_id).exec((err, user) => {
        expect(user.username).to.equal(expected_username);
        expect(user.display_name).to.equal(display_name);
        expect(req.getFlash('info_message')).to.equal('Username set.');
        expect(res.getRedirectPath()).to.equal('/');
        done();
      });
    });
  });
});

describe('UsersController.setPass', () => {
  const req = new RequestMock();
  const res = new ResponseMock();
  const password = 'password';
  const user = new UserModel({ password });
  user.updateCredentials();
  req.login(user);
  const user_id = user._id;

  it('should fail if current password is wrong', (done) => {
    const current_password = 'wrong password';
    req.setBody({ current_password });
    UsersController.editPass(req, res, () => {
      expect(req.getFlash('error_message')).to.equal('Wrong password.');
      expect(res.getRedirectPath()).to.equal('/account');
      done();
    });
  });

  it('should fail if new password is too short', (done) => {
    const new_password = '123';
    req.setBody({ current_password: password, password: new_password });
    UsersController.editPass(req, res, () => {
      expect(req.getFlash('error_message')).to.equal('Password must be at least 4 characters long.');
      expect(res.getRedirectPath()).to.equal('/account');
      done();
    });
  });

  it("should fail if new password doesn't match with confirmation", (done) => {
    const new_password = '1234';
    req.setBody({
      current_password: password,
      password: new_password,
      password_confirmation: 'asdf',
    });
    UsersController.editPass(req, res, () => {
      expect(req.getFlash('error_message')).to.equal("New password doesn't match with confirmation.");
      expect(res.getRedirectPath()).to.equal('/account');
      done();
    });
  });

  before(function before(done) {  // eslint-disable-line prefer-arrow-callback
    connectToTestDB(() => {
      const db_user = new UserModel({ _id: user_id, password });
      db_user.updateCredentials();
      db_user.save((err) => {
        if (err) throw err;
        done();
      });
    });
  });

  it('should succeed', (done) => {
    const new_password = '1234';
    req.setBody({
      current_password: password,
      password: new_password,
      password_confirmation: new_password,
    });
    UsersController.editPass(req, res, () => {
      UserModel.findById(user_id, (err, user_result) => {
        expect(user_result.authenticate(new_password)).is.true;
        expect(user_result.authenticate(password)).is.false;
        expect(user_result.password).to.not.equal(password);
        expect(user_result.password).to.not.equal(new_password);
        expect(user_result.salt).to.exist;
        expect(req.getFlash('info_message')).to.equal('Password updated.');
        expect(res.getRedirectPath()).to.equal('/account');
        done();
      });
    });
  });

  after(function after(done) {  // eslint-disable-line prefer-arrow-callback
    dropTestDB(done);
  });
});

describe('UsersController.delete', () => {
  const req = new RequestMock();
  const res = new ResponseMock();

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
    region: 'global'
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
    region: 'global'
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

  const user = {
    _id: user_id,
    _accounts: [account0._id, account1._id],
  };

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

  // Expects that the provided user has not changed from when it was set in beforeEach.
  // The user should have accounts and captains populated.
  function expectPopulatedUserUnchanged(populated_user) {
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
        cb();
      });
  }

  it('should fail if the user id is invalid', (done) => {
    req.login({ _id: 'invalid' });
    UsersController.delete(req, res, () => {
      expect(req.getFlash('error_message')).to.equal(getErrorMessage(ERROR_CODES.USERS_DELETE_ERROR_1));
      expect(res.getRedirectPath()).to.equal('/signup');
      expectDBUnchanged(done);
    });
  });

  it('should fail if the user was not found', (done) => {
    req.login({ _id: new mongoose.Types.ObjectId() });
    UsersController.delete(req, res, () => {
      expect(req.getFlash('error_message')).to.equal(getErrorMessage(ERROR_CODES.USERS_DELETE_ERROR_2));
      expect(res.getRedirectPath()).to.equal('/account');
      expectDBUnchanged(done);
    });
  });

  it('should succeed', (done) => {
    req.login({ _id: user_id });
    UsersController.delete(req, res, () => {
      expect(req.getFlash('info_message')).to.equal("I can't believe you've done this.");
      expect(res.getRedirectPath()).to.equal('/');
      UserModel.find().exec((e0, users) => {
        if (e0) throw e0;
        expect(users).to.have.lengthOf(0);
        AccountModel.find().exec((e1, accounts) => {
          if (e1) throw e1;
          expect(accounts).to.have.lengthOf(0);
          CaptainModel.find().exec((e2, captains) => {
            if (e2) throw e2;
            expect(captains).to.have.lengthOf(0);
            done();
          });
        });
      });
    });
  });
});
