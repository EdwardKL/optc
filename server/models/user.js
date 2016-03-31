// User model

import Captain from './captain';
import mongoose from 'mongoose';
var crypto = require('crypto');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: 'String' },
  password: { type: 'String' },
  salt: { type: 'String'},
  pirate_level: { type: 'Number', min: 1 },
  accounts: [{
    region: { type: String, enum: ['global', 'japan'] },
    friend_id: { type: Number, min: 100000000, max: 999999999 },
    _captains: [Schema.Types.ObjectId],
  }],
  last_login: { type: 'Date', default: Date.now },
  // OAuth IDs
  _facebook_id: { type: 'String' },
  _google_id: { type: 'String' },
  _reddit_id: { type: 'String' },
  _twitter_id: { type: 'String' }
});

/**
 * Hook a pre save method to hash the password
 */
userSchema.pre('save', function(next) {
  this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
  this.password = this.hashPassword(this.password);

  next();
});

/**
 * Create instance method for hashing a password
 */
userSchema.methods.hashPassword = function(password) {
  if (this.salt && password) {
    return crypto.pbkdf2Sync(password, this.salt, 10000, 64).toString('base64');
  } else {
    return password;
  }
};

/**
 * Create instance method for authenticating user
 */
userSchema.methods.authenticate = function(password) {
  return this.password === this.hashPassword(password);
};

var User = mongoose.model('User', userSchema);
module.exports = User;

