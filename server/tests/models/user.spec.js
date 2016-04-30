  /* eslint-disable no-unused-expressions */

import chai from 'chai';
import mongoose from 'mongoose';
require('../../models/account');
import UserModel from '../../models/user';
import { connectToTestDB, dropTestDB } from '../test_utils';

const expect = chai.expect;

describe('user.save', () => {
  const user_id = new mongoose.Types.ObjectId();

  beforeEach('Store a user', function beforeEach(done) {
    this.timeout(20 * 1e3);
    const user = new UserModel({
      _id: user_id,
    });
    connectToTestDB(() => {
      // Store the fake user into the DB.
      user.save(done);
    });
  });

  afterEach(function afterEach(done) {  // eslint-disable-line prefer-arrow-callback
    dropTestDB(done);
  });

  it('should save a user', (done) => {
    UserModel.findById(user_id)
    .populate('_accounts')
    .exec((err, user) => {
      if (err) throw err;
      expect(user).to.exist;
      done();
    });
  });
});
