/* eslint-disable no-unused-expressions */

import chai from 'chai';
import mongoose from 'mongoose';
import CaptainModel from '../../models/captain';
import RequestMock from '../mocks/request.mock';
import ResponseMock from '../mocks/response.mock';
import * as utils from '../../controllers/utils';
import { connectToTestDB, dropTestDB } from '../test_utils';

const expect = chai.expect;

describe('utils.hasId', () => {
  const ids = [
    new mongoose.Types.ObjectId(),
    new mongoose.Types.ObjectId(),
    new mongoose.Types.ObjectId()];

  it('should return true when the id is present', (done) => {
    expect(utils.hasId(ids, ids[0])).is.true;
    expect(utils.hasId(ids, ids[1])).is.true;
    expect(utils.hasId(ids, ids[2])).is.true;
    done();
  });

  it('should return true when the id is present, even if string form', (done) => {
    expect(utils.hasId(ids, ids[0].toString())).is.true;
    expect(utils.hasId(ids, ids[1].toString())).is.true;
    expect(utils.hasId(ids, ids[2].toString())).is.true;
    done();
  });

  it('should return false when the id is not present', (done) => {
    expect(utils.hasId(ids, new mongoose.Types.ObjectId())).is.false;
    done();
  });
});

describe('utils.redirectIfLoggedOut', () => {
  it('should redirect if logged out', (done) => {
    const req = new RequestMock();
    const res = new ResponseMock();
    expect(utils.redirectIfLoggedOut(req, res, () => {
      expect(req.getFlash('error_message')).to.equal('Please sign in.');
      expect(res.getRedirectPath()).to.equal('/signup');
    })).is.true;
    done();
  });

  it('should not redirect if logged in', (done) => {
    const req = new RequestMock();
    const res = new ResponseMock();
    req.login({});
    expect(utils.redirectIfLoggedOut(req, res, () => {
      expect(req.getFlash('error_message')).to.not.exist;
      expect(res.getRedirectPath()).to.not.exist;
    })).is.false;
    done();
  });
});

describe('utils.removeCaptains', () => {
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
    region: 'global'
  };

  beforeEach('Store captains', function beforeEach(done) {  // eslint-disable-line prefer-arrow-callback
    connectToTestDB(() => {
      const db_captain0 = new CaptainModel(captain0);
      const db_captain1 = new CaptainModel(captain1);
      const db_captain2 = new CaptainModel(captain2);
      db_captain0.save((e0) => {
        if (e0) throw e0;
        db_captain1.save((e1) => {
          if (e1) throw e1;
          db_captain2.save((e2) => {
            if (e2) throw e2;
            done();
          });
        });
      });
    });
  });

  afterEach(function afterEach(done) {  // eslint-disable-line prefer-arrow-callback
    dropTestDB(done);
  });

  function expectCaptainsEqual(actual_captain, expected_captain) {
    expect(actual_captain.current_level).to.equal(expected_captain.current_level);
    expect(actual_captain.current_special_level).to.equal(expected_captain.current_special_level);
    expect(actual_captain.current_hp_ccs).to.equal(expected_captain.current_hp_ccs);
    expect(actual_captain.current_atk_ccs).to.equal(expected_captain.current_atk_ccs);
    expect(actual_captain.current_rcv_ccs).to.equal(expected_captain.current_rcv_ccs);
    expect(actual_captain._user.toString().valueOf()).to.equal(user_id.toString().valueOf());
    expect(actual_captain._unit).to.equal(expected_captain._unit);
    expect(actual_captain.current_sockets).to.have.lengthOf(expected_captain.current_sockets.length);
    for (const i in expected_captain.current_sockets) {  // eslint-disable-line guard-for-in
      const actual_socket = actual_captain.current_sockets[i];
      const expected_socket = expected_captain.current_sockets[i];
      expect(actual_socket._socket).to.equal(expected_socket._socket);
      expect(actual_socket.socket_level).to.equal(expected_socket.socket_level);
    }
  }

  function getCaptainFromResult(id, results) {
    for (const result of results) {
      if (result._id.toString().valueOf() === id.toString().valueOf()) {
        return result;
      }
    }
  }

  it('should do nothing if given nothing', (done) => {
    expect(utils.removeCaptains([], () => {
      CaptainModel.find().exec((err, captains) => {
        expect(captains).to.have.lengthOf(3);
        const result0 = getCaptainFromResult(captain0._id, captains);
        const result1 = getCaptainFromResult(captain1._id, captains);
        const result2 = getCaptainFromResult(captain2._id, captains);
        expectCaptainsEqual(result0, captain0);
        expectCaptainsEqual(result1, captain1);
        expectCaptainsEqual(result2, captain2);
        done();
      });
    }));
  });

  it('should remove captains', (done) => {
    expect(utils.removeCaptains([captain0._id, captain2._id], () => {
      CaptainModel.find().exec((err, captains) => {
        expect(captains).to.have.lengthOf(1);
        const result1 = getCaptainFromResult(captain1._id, captains);
        expectCaptainsEqual(result1, captain1);
        done();
      });
    }));
  });
});
