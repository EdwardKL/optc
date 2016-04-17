/* eslint-disable */

import mocha from 'mocha';
import app from '../../server';
import chai from 'chai';
import request from 'supertest';
import mongoose from 'mongoose';
import User from '../../models/user';

const expect = chai.expect;

function connectDB(done) {
  if (mongoose.connection.name !== 'test') {
    return done();
  }

  mongoose.connect((process.env.MONGO_URL || 'mongodb://localhost:27017/test'), function (err) {
    if (err) return done(err);
    done();
  });
}

function dropDB(done) {
  if (mongoose.connection.name !== 'test') {
    return done();
  }

  mongoose.connection.db.dropDatabase(function (err) {
    mongoose.connection.close(done);
  });
}

describe('POST /signup', function () {

  beforeEach('connect and register a user', function (done) {

    connectDB(function () {
      done();
    });
  });

  afterEach(function (done) {
    dropDB(done);
  });

  it('Should correctly register a user', function (done) {
    // 5s timeout. Eventually we'll want to keep the default of 2s, but our site is slow :(
    this.timeout(5 * 1e3);
    request(app)
      .post('/signup')
      .send({ username: 'test-user', password: 'asdf', password_confirmation: 'asdf' })
      .end(function (err, res) {
        User.findByUsername('test-user', function (err, user) {
          expect(user.username).to.equal('test-user');
          done();
        });
      });
  });

});