/* eslint-disable no-unused-expressions */

import chai from 'chai';
import { getGlobbedFiles } from '../../util/server_utils';

const expect = chai.expect;

describe('getGlobbedFiles', () => {
  it('should return all strategy files when asked', (done) => {
    const strategies = getGlobbedFiles('./server/strategies/*.js');
    expect(strategies).to.have.members(
      ['./server/strategies/facebook.js',
       './server/strategies/google.js',
       './server/strategies/local.js',
       './server/strategies/reddit.js',
       './server/strategies/register.js',
       './server/strategies/twitter.js']);
    done();
  });

  it('should properly accept an array of globs', (done) => {
    const strategies = getGlobbedFiles(['./server/strategies/r*.js', './server/strategies/l*.js']);
    expect(strategies).to.have.members(
      ['./server/strategies/local.js',
       './server/strategies/reddit.js',
       './server/strategies/register.js']);
    done();
  });
});
