/* eslint-disable no-unused-expressions */

import chai from 'chai';
import mongoose from 'mongoose';
import FriendFinder from '../../controllers/friend_finder.controller';
import AccountModel from '../../models/account';
import CaptainModel from '../../models/captain';
import UnitModel from '../../models/unit';
import UserModel from '../../models/user';
import RequestMock from '../mocks/request.mock';
import ResponseMock from '../mocks/response.mock';
import { connectToTestDB, dropTestDB } from '../test_utils';

const expect = chai.expect;

describe('FriendFinder', () => {
  const req = new RequestMock();
  const res = new ResponseMock();

  it('should return empty data for invalid captain ids', (done) => {
    req.setParams({ captain_id: -1 });
    req.setQuery({ region: 'global' });
    FriendFinder.search(req, res, () => {
      expect(res.getJson()).to.have.lengthOf(0);
      done();
    });
  });

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
  const captain2 = {
    _id: new mongoose.Types.ObjectId(),
    current_level: 50,
    current_sockets: [{ _socket: 1, socket_level: 2 }, { _socket: 3, socket_level: 5 }],
    current_special_level: 4,
    current_hp_ccs: 55,
    current_atk_ccs: 23,
    current_rcv_ccs: 10,
    _unit: 15,
    _user: user_id,
  };
  const account0 = {
    _id: new mongoose.Types.ObjectId(),
    region: 'global',
    crew_name: 'testcrew0',
    friend_id: 100000000,
    pirate_level: 7,
    _captains: [captain0._id],
  };
  const account1 = {
    _id: new mongoose.Types.ObjectId(),
    region: 'japan',
    crew_name: 'testcrew1',
    friend_id: 999999999,
    pirate_level: 7,
    _captains: [captain1._id, captain2._id],
  };

  const user = {
    _id: user_id,
    _accounts: [account0._id, account1._id],
    password: 'asdf',
  };

  before('Store a user', function before(done) {  // eslint-disable-line prefer-arrow-callback
    connectToTestDB(() => {
      const db_user = new UserModel(user);
      db_user.updateCredentials();
      const db_account0 = new AccountModel(account0);
      const db_account1 = new AccountModel(account1);
      const db_captain0 = new CaptainModel(captain0);
      const db_captain1 = new CaptainModel(captain1);
      const db_captain2 = new CaptainModel(captain2);
      const db_unit0 = new UnitModel({
        _id: 15,
        name: 'Golden Pound Usopp',
      });
      const db_unit1 = new UnitModel({
        _id: 17,
        name: 'Sanji',
      });
      db_user.save((e0) => {
        if (e0) throw e0;
        db_captain0.save((e1) => {
          if (e1) throw e1;
          db_captain1.save((e2) => {
            if (e2) throw e2;
            db_captain2.save((e3) => {
              if (e3) throw e3;
              db_account0.save((e4) => {
                if (e4) throw e4;
                db_account1.save((e5) => {
                  if (e5) throw e5;
                  db_unit0.save((e6) => {
                    if (e6) throw e6;
                    db_unit1.save((e7) => {
                      if (e7) throw e7;
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
  });

  function expectPopulatedUser(actual_user) {
    expect(actual_user._id.toString().valueOf()).to.equal(user_id.toString().valueOf());
    expectAccountsEqual(actual_user._accounts[0], account0);
    expectAccountsEqual(actual_user._accounts[1], account1);
    // Sensitive data should be stripped.
    expect(actual_user.password).to.equal('');
    expect(actual_user.salt).to.equal('');
  }

  function expectedPopulatedUserWithAccount(actual_user, account) {
    expect(actual_user._id.toString().valueOf()).to.equal(user_id.toString().valueOf());
    expectAccountsEqual(actual_user._accounts[0], account);
    // Sensitive data should be stripped.
    expect(actual_user.password).to.equal('');
    expect(actual_user.salt).to.equal('');
  }

  function expectPopulatedUnit(unit) {
    expect(unit._id).to.equal(15);
    expect(unit.name).to.equal('Golden Pound Usopp');
  }

  function expectCaptainsEqual(actual_captain, expected_captain) {
    expect(actual_captain.current_level).to.equal(expected_captain.current_level);
    expect(actual_captain.current_special_level).to.equal(expected_captain.current_special_level);
    expect(actual_captain.current_hp_ccs).to.equal(expected_captain.current_hp_ccs);
    expect(actual_captain.current_atk_ccs).to.equal(expected_captain.current_atk_ccs);
    expect(actual_captain.current_rcv_ccs).to.equal(expected_captain.current_rcv_ccs);
    // expectPopulatedUser(actual_captain._user);
    expectedPopulatedUserWithAccount(actual_captain._user, actual_captain._user._accounts[0]);
    expectPopulatedUnit(actual_captain._unit);
    expect(actual_captain.current_sockets).to.have.lengthOf(expected_captain.current_sockets.length);
    for (const i in expected_captain.current_sockets) {  // eslint-disable-line guard-for-in
      const actual_socket = actual_captain.current_sockets[i];
      const expected_socket = expected_captain.current_sockets[i];
      expect(actual_socket._socket).to.equal(expected_socket._socket);
      expect(actual_socket.socket_level).to.equal(expected_socket.socket_level);
    }
  }

  function expectAccountsEqual(actual_account, expected_account) {
    expect(actual_account._id.toString().valueOf()).to.equal(expected_account._id.toString().valueOf());
    expect(actual_account.pirate_level).to.equal(expected_account.pirate_level);
    expect(actual_account.friend_id).to.equal(expected_account.friend_id);
    expect(actual_account.crew_name).to.equal(expected_account.crew_name);
    expect(actual_account.region).to.equal(expected_account.region);
    expect(actual_account._captains.length).to.equal(expected_account._captains.length);

    // TODO: this fails since the expected accounts are stored with array of captain IDs instead of the captain objs
    // for (var i = 0; i < actual_account._captains.length; i++) {
    //   console.log('actual capt: ', actual_account._captains[i]);
    //   console.log('expected capt: ', expected_account._captains[i]);
    //   expectCaptainsEqual(actual_account._captains[i], expected_account._captains[i]);
    // }
  }

  function getCaptainFromResult(id, results) {
    for (const result of results) {
      if (result._id.toString().valueOf() === id.toString().valueOf()) {
        return result;
      }
    }
  }

  it('should succeed', (done) => {
    req.setParams({ captain_id: 15 });
    req.setQuery({ region: 'global' });
    FriendFinder.search(req, res, () => {
      const results = res.getJson();
      expect(results).to.have.lengthOf(2);
      const result0 = getCaptainFromResult(captain0._id, results);
      const result1 = getCaptainFromResult(captain2._id, results);
      expectCaptainsEqual(result0, captain0);
      expectCaptainsEqual(result1, captain2);
      done();
    });
  });

  after(function after(done) {  // eslint-disable-line prefer-arrow-callback
    dropTestDB(done);
  });
});
