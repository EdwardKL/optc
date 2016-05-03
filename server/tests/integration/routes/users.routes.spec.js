/* eslint-disable no-unused-expressions */

import app from '../../../server';
import chai from 'chai';
import request from 'supertest';
import UserModel from '../../../models/user';
import { connectToTestDB, dropTestDB } from '../../test_utils';

const expect = chai.expect;

function expectSignupFailure(done, err, res) {
  if (err) throw err;
  expect(res.header.location).to.equal('/signup');
  UserModel.find().exec((e1, users) => {
    if (e1) throw e1;
    expect(users).to.have.lengthOf(0);
    done();
  });
}

describe('/signup', () => {
  const display_name = 'TestUser';
  const username = 'testuser';
  const password = 'password';

  before(function before(done) {  // eslint-disable-line prefer-arrow-callback
    connectToTestDB(done);
  });

  it('should fail if username <= 1 char', (done) => {
    request(app)
      .post('/signup')
      .send({
        username: 'a',
        password,
        password_confirmation: password,
      })
      .end(expectSignupFailure.bind(this, done));
  });

  it('should fail if username has invalid chars', (done) => {
    request(app)
      .post('/signup')
      .send({
        username: 'invalid user',
        password,
        password_confirmation: password,
      })
      .end(expectSignupFailure.bind(this, done));
  });

  it('should fail if password has <= 3 chars', (done) => {
    request(app)
      .post('/signup')
      .send({
        username: 'user',
        password: 'asd',
        password_confirmation: 'asd',
      })
      .end(expectSignupFailure.bind(this, done));
  });

  it("should fail if password doesn't match confirmation", (done) => {
    request(app)
      .post('/signup')
      .send({
        username: 'user',
        password,
        password_confirmation: 'some other pass',
      })
      .end(expectSignupFailure.bind(this, done));
  });

  it('should succeed', (done) => {
    request(app)
      .post('/signup')
      .send({
        username: display_name,
        password,
        password_confirmation: password,
      })
      .end((e0, res) => {
        if (e0) throw e0;
        expect(res.header.location).to.equal('/');
        UserModel.find().exec((e1, users) => {
          if (e1) throw e1;
          expect(users).to.have.lengthOf(1);
          const user = users[0];
          expect(user.username).to.equal(username);
          expect(user.display_name).to.equal(display_name);
          expect(user.authenticate(password)).is.true;
          expect(user.is_local).is.true;
          expect(user.password).to.exist;
          expect(user.salt).to.exist;
          done();
        });
      });
  });

  after(function after(done) {  // eslint-disable-line prefer-arrow-callback
    dropTestDB(done);
  });
});

describe('/signup with existing user', () => {
  before(function before(done) {  // eslint-disable-line prefer-arrow-callback
    connectToTestDB(() => {
      const user = new UserModel({ username: 'user' });
      user.save((err) => {
        if (err) throw err;
        done();
      });
    });
  });

  it('should fail if username exists', (done) => {
    request(app)
      .post('/signup')
      .send({
        username: 'user',
        password: 'asdf',
        password_confirmation: 'asdf',
      })
      .end((err, res) => {
        if (err) throw err;
        expect(res.header.location).to.equal('/signup');
        UserModel.find().exec((e1, users) => {
          if (e1) throw e1;
          expect(users).to.have.lengthOf(1);
          const user = users[0];
          expect(user.username).to.equal('user');
          // These are unset, as we didn't set them in the before clause above.
          expect(user.display_name).to.not.exist;
          expect(user.password).to.not.exist;
          done();
        });
      });
  });

  after(function after(done) {  // eslint-disable-line prefer-arrow-callback
    dropTestDB(done);
  });
});

describe('/login', () => {
  const username = 'test-user-login';
  const password = 'test-password';

  before(function before(done) {  // eslint-disable-line prefer-arrow-callback
    connectToTestDB(() => {
      const user = new UserModel({ username, password });
      user.updateCredentials();
      user.save((err) => {
        if (err) throw err;
        done();
      });
    });
  });

  function expectLoginFailure(done, err, res) {
    if (err) throw err;
    expect(res.header.location).to.equal('/signup');
    done();
  }

  it('should fail if no username', (done) => {
    request(app)
      .post('/login')
      .send({
        password: 'asdf',
      })
      .end(expectLoginFailure.bind(this, done));
  });

  it('should fail if empty username', (done) => {
    request(app)
      .post('/login')
      .send({
        username: '',
      })
      .end(expectLoginFailure.bind(this, done));
  });

  it('should fail if no password', (done) => {
    request(app)
      .post('/login')
      .send({
        username: 'user',
      })
      .end(expectLoginFailure.bind(this, done));
  });

  it('should fail if empty password', (done) => {
    request(app)
      .post('/login')
      .send({
        password: '',
      })
      .end(expectLoginFailure.bind(this, done));
  });

  it('should fail if username is wrong', (done) => {
    request(app)
      .post('/login')
      .send({
        username: 'wrong-user',
        password,
      })
      .end(expectLoginFailure.bind(this, done));
  });

  it('should fail if password is wrong', (done) => {
    request(app)
      .post('/login')
      .send({
        username,
        password: 'wrong-password',
      })
      .end(expectLoginFailure.bind(this, done));
  });

  it('should succeed', (done) => {
    request(app)
      .post('/login')
      .send({
        username,
        password,
      })
      .end((err, res) => {
        expect(res.header.location).to.equal('/');
        done();
      });
  });

  after(function after(done) {  // eslint-disable-line prefer-arrow-callback
    dropTestDB(done);
  });
});
