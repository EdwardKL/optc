/* eslint-disable no-unused-expressions */

import app from '../../server';
import chai from 'chai';
import request from 'supertest';

const expect = chai.expect;

describe('Server', () => {
  it('should redirect if logged out when accessing /account', (done) => {
    request(app)
      .get('/account')
      .end((err, res) => {
        expect(res.header.location).to.equal('/signup');
        done();
      });
  });

  it('should redirect if logged out when accessing /auth/oauth-signup', (done) => {
    request(app)
      .get('/auth/oauth-signup')
      .end((err, res) => {
        expect(res.header.location).to.equal('/');
        done();
      });
  });
/*
  it('should redirect if has username when accessing /auth/oauth-signup', (done) => {
    const username = 'test-user';
    request(app)
      .get('/auth/oauth-signup')
      .send({ username })
      .end((err, res) => {
        expect(res.header.location).to.equal('/');
        done();
      });
  });*/
});
