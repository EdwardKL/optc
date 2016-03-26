// User model

import Captain from './captain';
import mongoose from 'mongoose';
var crypto = require('crypto');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: 'String', required: true },
  password: { type: 'String', required: true },
  pirate_level: { type: 'Number', min: 1, required: true },
  accounts: [{
    region: { type: String, enum: ['global', 'japan', 'france'] },
    friend_id: { type: Number, min: 100000000, max: 999999999 }
  }],
  last_login: { type: 'Date', default: Date.now },
  _captains: [Schema.Types.ObjectId]
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

