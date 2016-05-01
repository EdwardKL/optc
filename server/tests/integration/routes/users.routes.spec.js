/* eslint-disable no-unused-expressions */

import app from '../../../server';
import chai from 'chai';
import request from 'supertest';
import UserModel from '../../../models/user';

const expect = chai.expect;

describe('/signup', () => {
  const display_name = 'TestUser';
  const username = 'testuser';
  const password = 'password';

  it('should redirect if logged out when accessing /account', (done) => {
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
});
