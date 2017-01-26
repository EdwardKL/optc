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

describe('FriendFinder tests', () => {
  const req = new RequestMock();
  const res = new ResponseMock();

  it('should return empty data for invalid captain ids', (done) => {
    req.setParams({ captain_id: -1 });
    req.setQuery({ region: 'global', page: 1 });
    FriendFinder.search(req, res, () => {
      expect(res.getJson()).to.have.lengthOf(0);
      done();
    });
  });

  const account0_id = new mongoose.Types.ObjectId();
  const account1_id = new mongoose.Types.ObjectId();
  const account2_id = new mongoose.Types.ObjectId();
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
    _account: account0_id,
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
    _account: account1_id,
    region: 'japan'
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
    _account: account1_id,
    region: 'japan'
  };
  const captain3 = {
    _id: new mongoose.Types.ObjectId(),
    current_level: 5,
    current_sockets: [],
    current_special_level: 1,
    current_hp_ccs: 1,
    current_atk_ccs: 2,
    current_rcv_ccs: 1,
    _unit: 200,
    _user: user_id,
    _account: account2_id,
    region: 'japan'
  };
  const captain4 = {
    _id: new mongoose.Types.ObjectId(),
    current_level: 4,
    current_sockets: [],
    current_special_level: 1,
    current_hp_ccs: 100,
    current_atk_ccs: 99,
    current_rcv_ccs: 1,
    _unit: 17,
    _user: user_id,
    _account: account1_id,
    region: 'japan'
  };
  const account0 = {
    _id: account0_id,
    region: 'global',
    crew_name: 'testcrew0',
    friend_id: 100000000,
    pirate_level: 7,
    _captains: [captain0._id],
  };
  const account1 = {
    _id: account1_id,
    region: 'japan',
    crew_name: 'testcrew1',
    friend_id: 999999999,
    pirate_level: 7,
    _captains: [captain1._id, captain2._id, captain4._id],
  };
  const account2 = {
    _id: account2_id,
    region: 'japan',
    crew_name: 'testcrew2',
    friend_id: 999999998,
    pirate_level: 70,
    _captains: [captain3._id],
  };

  const user = {
    _id: user_id,
    _accounts: [account0_id, account1_id, account2_id],
    password: 'asdf',
  };

  // helper function to recursively add a captain with a particular unit id/region many times.
  const add_captains_with_region = function add_captains(num_times, unit_id, region, done) {
    const captain = new CaptainModel({
      _id: new mongoose.Types.ObjectId(),
      current_level: Math.floor(Math.random() * 99) + 1,
      current_sockets: [],
      current_special_level: 1,
      current_hp_ccs: 5,
      current_atk_ccs: 2,
      current_rcv_ccs: 3,
      _unit: unit_id,
      _user: user_id,
      _account: account2_id,
      region: region
    });
    captain.save(() => {
      if (num_times === 1) {
        done();
        return;
      }
      add_captains(num_times - 1, unit_id, region, done);
    });
  };

  before('Store a user', function before(done) {  // eslint-disable-line prefer-arrow-callback
    connectToTestDB(() => {
      const db_user = new UserModel(user);
      db_user.updateCredentials();
      const db_account0 = new AccountModel(account0);
      const db_account1 = new AccountModel(account1);
      const db_account2 = new AccountModel(account2);
      const db_captain0 = new CaptainModel(captain0);
      const db_captain1 = new CaptainModel(captain1);
      const db_captain2 = new CaptainModel(captain2);
      const db_captain3 = new CaptainModel(captain3);
      const db_captain4 = new CaptainModel(captain4);

      const db_unit0 = new UnitModel({
        _id: 15,
        name: 'Golden Pound Usopp',
      });
      const db_unit1 = new UnitModel({
        _id: 17,
        name: 'Sanji',
      });
      const db_unit101 = new UnitModel({
        _id: 101,
        name: 'Blue Striped Dragon'
      });
      db_user.save((e0) => {
        if (e0) throw e0;
        db_captain0.save((e1) => {
          if (e1) throw e1;
          db_captain1.save((e2) => {
            if (e2) throw e2;
            db_captain2.save((e3) => {
              if (e3) throw e3;
              db_captain3.save((e4) => {
                if (e4) throw e4;
                db_captain4.save((e5) => {
                  if (e5) throw e5;
                  db_account0.save((e6) => {
                    if (e6) throw e6;
                    db_account1.save((e7) => {
                      if (e7) throw e7;
                      db_account2.save((e8) => {
                        if (e8) throw e8;
                        db_unit0.save((e9) => {
                          if (e9) throw e9;
                          db_unit1.save((e10) => {
                            if (e10) throw e10;
                            db_unit101.save((e11) => {
                              if (e11) throw e11;

                              // lol
                              add_captains_with_region(20, 101, 'global', done);
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
        });
      });
    });
  });

  function expectPopulatedUser(actual_user) {
    expect(actual_user._id.toString().valueOf()).to.equal(user_id.toString().valueOf());
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
    expect(actual_captain.region).to.equal(expected_captain.region);
    expectPopulatedUser(actual_captain._user);
    expectAccountsEqual(actual_captain._account, account0);
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
    console.log('results: ', results);
    for (const result of results) {
      if (result._id.toString().valueOf() === id.toString().valueOf()) {
        return result;
      }
    }
  }

  it('should succeed', (done) => {
    req.setParams({ captain_id: 15 });
    req.setQuery({ region: 'global', page: 1 });
    FriendFinder.search(req, res, () => {
      const results = res.getJson();
      expect(results).to.have.lengthOf(1);
      const foundCaptain = getCaptainFromResult(captain0._id, results);
      expectCaptainsEqual(foundCaptain, captain0);
      done();
    });
  });

  it('should return captains sorted by current level', (done) => {
    req.setParams({ captain_id: 17 });
    req.setQuery({ region: 'japan', page: 1 });
    FriendFinder.search(req, res, () => {
      const results = res.getJson();
      expect(results).to.have.lengthOf(2);
      // ensure captain1 (with higher level) is returned first
      expect(results[0].current_level).to.equal(captain1.current_level);
      expect(results[1].current_level).to.equal(captain4.current_level);
      done();
    });
  });

  it('should not find captain in a different region', (done) => {
    req.setParams({ captain_id: 200 });
    req.setQuery({ region: 'global', page: 1 });
    FriendFinder.search(req, res, () => {
      const results = res.getJson();
      expect(results).to.have.lengthOf(0);
      done();
    });
  });

  it('should find second page of captains (for page size = 10)', (done) => {
    req.setParams({captain_id: 101});
    req.setQuery({region: 'global', page: 2});
    FriendFinder.search(req, res, () => {
      const results = res.getJson();
      expect(results).to.have.lengthOf(10);
      for (const result of results) {
        expectPopulatedUser(result._user);
        expect(result.current_special_level).to.equal(1);
      }
      done();
    });
  });

  it('should fetch the right amount of pages (for page size = 10)', (done) => {
    req.setParams({captain_id: 101});
    FriendFinder.fetchNumPages(req, res, () => {
      const results = res.getJson();
      expect(results).to.equal(2);
      done();
    })
  });

  after(function after(done) {  // eslint-disable-line prefer-arrow-callback
    dropTestDB(done);
  });
});
