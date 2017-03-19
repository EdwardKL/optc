// User model
import mongoose from 'mongoose';
import crypto from 'crypto';

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, lowercase: true, trim: true },
  display_name: { type: String, trim: true },
  email: { type: String, trim: true },
  password: { type: String },
  forgot_password_token: { type: String },
  fpt_timestamp: { type: Date },
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
  // Used to make sure we ask users for an email only once.
  asked_for_email: { type: Boolean, default: false },
});

// Clears all sensitive data from the user.
userSchema.methods.clearSensitiveData = function clearSensitiveData() {
  this.password = '';
  this.salt = '';
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

const User = mongoose.model('User', userSchema);
module.exports = User;
