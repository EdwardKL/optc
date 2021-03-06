// Utils used for tests.
import mongoose from 'mongoose';
import mongoConfig from '../config';

export function connectToTestDB(done) {
  // If it's already connected, do nothing.
  if (mongoose.connection.readyState === 1 || mongoose.connection.readyState === 2) {
    done();
    return;
  }
  mongoose.connect(mongoConfig.mongoURL, (err) => {
    if (err) return done(err);
    done();
  });
}

export function dropTestDB(done) {
  if (mongoose.connection.name !== 'optc-test') {
    return done();
  }

  mongoose.connection.db.dropDatabase((err) => {
    if (err) throw err;
    mongoose.connection.close(done);
  });
}
