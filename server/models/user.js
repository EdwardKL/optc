// User model

import Captain from './captain';
import mongoose from 'mongoose';
var crypto = require('crypto');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, lowercase: true, trim: true},
  display_name: { type: String, trim: true },
  password: { type: String },
  salt: { type: String },
  accounts: [{
    id: { type: Number, min: 0 },
    region: { type: String, enum: ['global', 'japan'] },
    crew_name: { type: String },
    friend_id: { type: Number, min: 100000000, max: 999999999 },
    pirate_level: { type: Number, min: 1 },
    _captains: [{ type: Schema.Types.ObjectId, ref: 'Captain' }],
  }],
  last_login: { type: Date, default: Date.now },
  is_local: { type: Boolean, default: false },
  // OAuth IDs
  _facebook_id: { type: String },
  _google_id: { type: String },
  _reddit_id: { type: String },
  _twitter_id: { type: String }
});

// Sets username properly.
userSchema.methods.setUsername = function(username) {
  this.display_name = username.trim();
  this.username = username;
};

// Returns true if the given username has valid characters.
userSchema.statics.validUsername = function(username) {
  return /^[a-zA-Z\-_0-9]+$/.test(username);
};

// Use to find by username, case and whitespace insensitive.
userSchema.statics.findByUsername = function(username, callback) {
  var formatted_username = username.trim().toLowerCase();
  this.findOne({ username: formatted_username }, function(err, user) {
    callback(err, user);
  });
};

// Updates user with salt and hashed password.
userSchema.methods.updateCredentials = function() {
  this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
  this.password = this.hashPassword(this.password);
};

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

