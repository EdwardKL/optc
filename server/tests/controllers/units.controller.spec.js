/* eslint-disable no-unused-expressions */

import chai from 'chai';
import mongoose from 'mongoose';
import UnitController from '../../controllers/units.controller';
import CaptainAbilityModel from '../../models/captain_ability';
import SpecialModel from '../../models/special';
import UnitModel from '../../models/unit';
import RecommendationModel from '../../models/recommendation';
import RequestMock from '../mocks/request.mock';
import ResponseMock from '../mocks/response.mock';
import { connectToTestDB, dropTestDB } from '../test_utils';
import RECOMMENDATION from '../../../constants/recommendation';

const expect = chai.expect;

describe('units.fetchUnits', () => {
  const unit1 = new UnitModel({
    _id: 17,
    name: 'unit1',
  });
  const unit2 = new UnitModel({
    _id: 28,
    name: 'unit2',
  });
  const unit3 = new UnitModel({
    _id: 5,
    name: 'unit3',
  });
  const unit4 = new UnitModel({
    _id: 47,
    name: 'unit4',
  });
  const unit5 = new UnitModel({
    _id: 42,
    name: 'unit5',
  });
  const req = new RequestMock();
  req.setParams({ page: 1 });
  const res = new ResponseMock();
  before('Store units', function before(done) {  // eslint-disable-line prefer-arrow-callback
    connectToTestDB(() => {
      // Store the fake units into the DB.
      unit1.save(() => {
        unit2.save(() => {
          unit3.save(() => {
            unit4.save(() => {
              unit5.save(done);
            });
          });
        });
      });
    });
  });

  it('should return ids in order with their names', (done) => {
    UnitController.fetchUnits(req, res, () => {
      expect(res.getJson()).to.be.eql([
        { id: 5, name: 'unit3' },
        { id: 17, name: 'unit1' },
        { id: 28, name: 'unit2' }]);
      done();
    });
  });

  it('should return the second page properly', (done) => {
    req.setParams({ page: 2 });
    UnitController.fetchUnits(req, res, () => {
      expect(res.getJson()).to.be.eql([
        { id: 42, name: 'unit5' },
        { id: 47, name: 'unit4' }]);
      done();
    });
  });

  after(function after(done) {  // eslint-disable-line prefer-arrow-callback
    dropTestDB(done);
  });
});

const add_units = function add_units(num_times, done) {
  const unit = new UnitModel({
    _id: num_times,
    name: 'dummy unit created by add_units',
  });
  unit.save(() => {
    if (num_times === 1) {
      done();
      return;
    }
    add_units(num_times - 1, done);
  });
};

describe('units.fetchNumUnitPages', () => {
  before('Store 40 units', (done) => {
    connectToTestDB(() => {
      add_units(40, done);
    });
  });

  const req = new RequestMock();
  const res = new ResponseMock();
  it('should return num unit pages', (done) => {
    UnitController.fetchNumUnitPages(req, res, () => {
      expect(res.getJson()).to.be.eql(1);
      done();
    });
  });

  after(function after(done) {  // eslint-disable-line prefer-arrow-callback
    dropTestDB(done);
  });
});

describe('units.fetchNumUnitPages', () => {
  before('Store 41 units', (done) => {
    connectToTestDB(() => {
      add_units(41, done);
    });
  });

  const req = new RequestMock();
  const res = new ResponseMock();
  it('should return num unit pages, rounded up', (done) => {
    UnitController.fetchNumUnitPages(req, res, () => {
      expect(res.getJson()).to.be.eql(2);
      done();
    });
  });

  after(function after(done) {  // eslint-disable-line prefer-arrow-callback
    dropTestDB(done);
  });
});

describe('units.fetch', () => {
  const captain_ability = new CaptainAbilityModel({
    _id: 1,
    description: 'test description',
  });

  const special = new SpecialModel({
    _id: 2,
    notes: 'test notes',
    subspecials: [{
      name: 'subspecial',
      stages: [{
        description: 'subspecial_descript',
        base_cd: 10,
        max_cd: 20,
      }],
      region: 'japan',
    }],
  });
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
      // Store the fake unit into the DB.
      unit.save((e1) => {
        special.save((e2) => {
          captain_ability.save(done);
        });
      });
    });
  });

  it('should return nothing if unit was not found', (done) => {
    req.setParams({ id: 342523534 });
    UnitController.fetch(req, res, () => {
      expect(res.getJson()).to.be.empty;
      done();
    });
  });

  const expectSpecialPopulated = (actual) => {
    expect(actual._id).to.equal(special._id);
    expect(actual.notes).to.equal(special.notes);
    expect(actual.subspecials[0].name).to.equal(special.subspecials[0].name);
    expect(actual.subspecials[0].region).to.equal(special.subspecials[0].region);
    expect(actual.subspecials[0].stages[0].description).to.equal(special.subspecials[0].stages[0].description);
    expect(actual.subspecials[0].stages[0].base_cd).to.equal(special.subspecials[0].stages[0].base_cd);
    expect(actual.subspecials[0].stages[0].max_cd).to.equal(special.subspecials[0].stages[0].max_cd);
  };

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
      expect(actual_unit.captain_ability._id).to.equal(captain_ability._id);
      expect(actual_unit.captain_ability.description).to.equal(captain_ability.description);
      expectSpecialPopulated(actual_unit.special_ability);
      expect(actual_unit.region).to.equal(unit.region);
      done();
    });
  });

  after(function after(done) {  // eslint-disable-line prefer-arrow-callback
    dropTestDB(done);
  });
});

describe('units.recommend', () => {
  const req = new RequestMock();
  const res = new ResponseMock();

  const user_id = new mongoose.Types.ObjectId();

  const recommendation = new RecommendationModel({ _user: user_id, _unit: 4, recommended: false });

  before('Store a recommendation', function before(done) {  // eslint-disable-line prefer-arrow-callback
    connectToTestDB(() => {
      recommendation.save(done);
    });
  });

  afterEach(function afterEach(done) {  // eslint-disable-line prefer-arrow-callback
    req.clearFlash();
    done();
  });

  it('should redirect when signed out', (done) => {
    UnitController.recommend(req, res, () => {
      expect(req.getFlash('error_message')).to.equal('Please sign in.');
      expect(res.getRedirectPath()).to.equal('/signup');
      done();
    });
  });

  it('should store a recommendation', (done) => {
    req.setParams({ id: 3, recommended: '1' });
    req.login({ _id: user_id });
    UnitController.recommend(req, res, () => {
      RecommendationModel.findOne({ _user: user_id, _unit: 3 }).exec((err, doc) => {
        expect(req.getFlash('error_message')).to.not.exist;
        expect(doc._user.toString().valueOf()).to.equal(user_id.toString().valueOf());
        expect(doc._unit).to.equal(3);
        expect(doc.recommended).to.be.true;
        done();
      });
    });
  });

  it('should store a negative recommendation', (done) => {
    req.setParams({ id: 5, recommended: 0 });
    req.login({ _id: user_id });
    UnitController.recommend(req, res, () => {
      RecommendationModel.findOne({ _user: user_id, _unit: 5 }).exec((err, doc) => {
        expect(req.getFlash('error_message')).to.not.exist;
        expect(doc._user.toString().valueOf()).to.equal(user_id.toString().valueOf());
        expect(doc._unit).to.equal(5);
        expect(doc.recommended).to.be.false;
        done();
      });
    });
  });

  it('should delete if the same recommendation already exists', (done) => {
    req.setParams({ id: 4, recommended: 0 });
    req.login({ _id: user_id });
    UnitController.recommend(req, res, () => {
      expect(req.getFlash('error_message')).to.not.exist;
      expect(res.getRedirectPath()).to.equal('/unit/4');
      RecommendationModel.findOne({ _user: user_id, _unit: 4 }).exec((err, doc) => {
        expect(doc).to.not.exist;
        done();
      });
    });
  });

  it('should swap recommendations', (done) => {
    req.setParams({ id: 4, recommended: '1' });
    req.login({ _id: user_id });
    UnitController.recommend(req, res, () => {
      RecommendationModel.findOne({ _user: user_id, _unit: 4 }).exec((err, doc) => {
        expect(req.getFlash('error_message')).to.not.exist;
        expect(doc._user.toString().valueOf()).to.equal(user_id.toString().valueOf());
        expect(doc._unit).to.equal(4);
        expect(doc.recommended).to.be.true;
        done();
      });
    });
  });

  after(function after(done) {  // eslint-disable-line prefer-arrow-callback
    dropTestDB(done);
  });
});

describe('units.fetchGlobalRecommendations', () => {
  const req = new RequestMock();
  const res = new ResponseMock();

  const recommendation1 = new RecommendationModel({
    _user: new mongoose.Types.ObjectId(),
    _unit: 4,
    recommended: false,
  });
  const recommendation2 = new RecommendationModel({
    _user: new mongoose.Types.ObjectId(),
    _unit: 4,
    recommended: true,
  });
  const recommendation3 = new RecommendationModel({
    _user: new mongoose.Types.ObjectId(),
    _unit: 4,
    recommended: false,
  });
  const recommendation4 = new RecommendationModel({
    _user: new mongoose.Types.ObjectId(),
    _unit: 5,
    recommended: false,
  });

  before('Store recommendations', function before(done) {  // eslint-disable-line prefer-arrow-callback
    connectToTestDB(() => {
      recommendation1.save(() => {
        recommendation2.save(() => {
          recommendation3.save(() => {
            recommendation4.save(done);
          });
        });
      });
    });
  });

  it('should return 0s if no recommendation', (done) => {
    req.setParams({ id: -1 });
    UnitController.fetchGlobalRecommendations(req, res, () => {
      const recommendations = res.getJson();
      expect(recommendations.recommended).to.equal(0);
      expect(recommendations.not_recommended).to.equal(0);
      done();
    });
  });

  it('should return right thing for unit 4', (done) => {
    req.setParams({ id: 4 });
    UnitController.fetchGlobalRecommendations(req, res, () => {
      const recommendations = res.getJson();
      expect(recommendations.recommended).to.equal(1);
      expect(recommendations.not_recommended).to.equal(2);
      done();
    });
  });

  it('should return right thing for unit 5', (done) => {
    req.setParams({ id: 5 });
    UnitController.fetchGlobalRecommendations(req, res, () => {
      const recommendations = res.getJson();
      expect(recommendations.recommended).to.equal(0);
      expect(recommendations.not_recommended).to.equal(1);
      done();
    });
  });

  after(function after(done) {  // eslint-disable-line prefer-arrow-callback
    dropTestDB(done);
  });
});

describe('units.fetchRecommendation', () => {
  const req = new RequestMock();
  const res = new ResponseMock();

  const user_id = new mongoose.Types.ObjectId();

  const recommendation1 = new RecommendationModel({
    _user: user_id,
    _unit: 4,
    recommended: false,
  });

  const recommendation2 = new RecommendationModel({
    _user: user_id,
    _unit: 5,
    recommended: true,
  });

  before('Store recommendation', function before(done) {  // eslint-disable-line prefer-arrow-callback
    connectToTestDB(() => {
      recommendation1.save((err) => {
        recommendation2.save(done);
      });
    });
  });

  it('should return UNABLE if signed out', (done) => {
    req.setParams({ id: 4 });
    UnitController.fetchRecommendation(req, res, () => {
      expect(res.getJson()).to.be.equal(RECOMMENDATION.UNABLE);
      done();
    });
  });

  it('should return NONE if no recommendation', (done) => {
    req.setParams({ id: -1, user_id });
    UnitController.fetchRecommendation(req, res, () => {
      expect(res.getJson()).to.be.equal(RECOMMENDATION.NONE);
      done();
    });
  });

  it('should return NEGATIVE if negative recommendation exists', (done) => {
    req.setParams({ id: 4, user_id });
    UnitController.fetchRecommendation(req, res, () => {
      expect(res.getJson()).to.be.equal(RECOMMENDATION.NEGATIVE);
      done();
    });
  });

  it('should return POSITIVE if positive recommendation exists', (done) => {
    req.setParams({ id: 5, user_id });
    UnitController.fetchRecommendation(req, res, () => {
      expect(res.getJson()).to.be.equal(RECOMMENDATION.POSITIVE);
      done();
    });
  });

  after(function after(done) {  // eslint-disable-line prefer-arrow-callback
    dropTestDB(done);
  });
});
