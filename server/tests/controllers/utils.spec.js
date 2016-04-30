import chai from 'chai';
import mongoose from 'mongoose';
import * as utils from '../../controllers/utils';

const expect = chai.expect;

describe('utils', () => {
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
