/* eslint-disable no-unused-expressions */

import chai from 'chai';
import UnitController from '../../controllers/units.controller';
import UnitModel from '../../models/unit';
import RequestMock from '../mocks/request.mock';
import ResponseMock from '../mocks/response.mock';
import { connectToTestDB, dropTestDB } from '../test_utils';

const expect = chai.expect;

describe('units.fetch', () => {
  const unit = new UnitModel({
    _id: 777,
    name: 'test unit',
    type: 'STR',
    classes: ['Fighter', 'Tough'],
    stars: 5,
    cost: 50,
    combo: 4,
    slots: 2,
    max_level: 45,
    max_exp: 9,
    base_hp: 100,
    base_atk: 1000,
    base_rcv: -10,
    max_hp: 200,
    max_atk: 1400,
    max_rcv: 0,
    captain_ability: 1,
    special_ability: 2,
    region: 'all',
  });
  // Setup fake user.
  const req = new RequestMock();
  const res = new ResponseMock();
  before('Store a unit', function before(done) {  // eslint-disable-line prefer-arrow-callback
    connectToTestDB(() => {
      // Store the fake user into the DB.
      unit.save(done);
    });
  });

  it('should return nothing if unit was not found', (done) => {
    req.setParams({ id: 342523534 });
    UnitController.fetch(req, res, () => {
      expect(res.getJson()).to.be.empty;
      done();
    });
  });

  it('should return the unit if found', (done) => {
    req.setParams({ id: unit._id });
    UnitController.fetch(req, res, () => {
      const actual_unit = res.getJson();
      expect(actual_unit.name).to.equal(unit.name);
      expect(actual_unit.type).to.equal(unit.type);
      expect(actual_unit.classes[0]).to.equal(unit.classes[0]);
      expect(actual_unit.classes[1]).to.equal(unit.classes[1]);
      expect(actual_unit.stars).to.equal(unit.stars);
      expect(actual_unit.cost).to.equal(unit.cost);
      expect(actual_unit.combo).to.equal(unit.combo);
      expect(actual_unit.slots).to.equal(unit.slots);
      expect(actual_unit.max_level).to.equal(unit.max_level);
      expect(actual_unit.max_exp).to.equal(unit.max_exp);
      expect(actual_unit.base_hp).to.equal(unit.base_hp);
      expect(actual_unit.base_atk).to.equal(unit.base_atk);
      expect(actual_unit.base_rcv).to.equal(unit.base_rcv);
      expect(actual_unit.max_hp).to.equal(unit.max_hp);
      expect(actual_unit.max_atk).to.equal(unit.max_atk);
      expect(actual_unit.max_rcv).to.equal(unit.max_rcv);
      expect(actual_unit.captain_ability).to.equal(unit.captain_ability);
      expect(actual_unit.special_ability).to.equal(unit.special_ability);
      expect(actual_unit.region).to.equal(unit.region);
      done();
    });
  });

  after(function after(done) {  // eslint-disable-line prefer-arrow-callback
    dropTestDB(done);
  });
});
