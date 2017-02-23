/* eslint-disable no-unused-expressions */

import chai from 'chai';
import { padNumber } from '../utils';

const expect = chai.expect;

describe('padNumber', () => {
  it('should pad numbers', (done) => {
    expect(padNumber(0)).to.equal('000000000');
    expect(padNumber(10)).to.equal('000000010');
    expect(padNumber(100)).to.equal('000000100');
    expect(padNumber(9999)).to.equal('000009999');
    expect(padNumber(10000)).to.equal('000010000');
    expect(padNumber(123456)).to.equal('000123456');
    expect(padNumber(1234567)).to.equal('001234567');
    expect(padNumber(12345678)).to.equal('012345678');
    expect(padNumber(123456789)).to.equal('123456789');
    done();
  });
});
