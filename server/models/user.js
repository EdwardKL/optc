// User model
import mongoose from 'mongoose';
import crypto from 'crypto';

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, lowercase: true, trim: true },
  display_name: { type: String, trim: true },
  password: { type: String },
  salt: { type: String },
  _accounts: [{ type: Schema.Types.ObjectId, ref: 'Account' }],
  last_login: { type: Date, default: Date.now },
  // True if signed up using local method.
  is_local: { type: Boolean, default: false },
  // OAuth IDs
  _facebook_id: { type: String },
  _google_id: { type: String },
  _reddit_id: { type: String },
  _twitter_id: { type: String },
});

// Sets username properly.
userSchema.methods.setUsername = function setUsername(username) {
  this.display_name = username.trim();
  this.username = username;
};

// Returns true if the given username has valid characters.
userSchema.statics.validUsername = function validUsername(username) {
  return /^[a-zA-Z\-_0-9]+$/.test(username);
};

userSchema.statics.convertToUsername = function convertToUsername(username) {
  return username.trim().toLowerCase();
};

// Use to find by username, case and whitespace insensitive.
userSchema.statics.findByUsername = function findByUsername(username, callback) {
  const formatted_username = this.convertToUsername(username);
  this.findOne({ username: formatted_username }, (err, user) => {
    callback(err, user);
  });
};

// Updates user with salt and hashed password.
userSchema.methods.updateCredentials = function updateCredentials() {
  this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
  this.password = this.hashPassword(this.password);
};

/**
 * Create instance method for hashing a password
 */
userSchema.methods.hashPassword = function hashPassword(password) {
  if (this.salt && password) {
    return crypto.pbkdf2Sync(password, this.salt, 10000, 64).toString('base64');
  }
  return password;
};

/**
 * Create instance method for authenticating user
 */
userSchema.methods.authenticate = function authenticate(password) {
  return this.password === this.hashPassword(password);
};

const User = mongoose.model('User', userSchema, 'User');
module.exports = User;
