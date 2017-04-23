// Special model
import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const passwordResetTokenSchema = new Schema({
  _user_id: { type: Schema.Types.ObjectId, ref: 'User' },
  token: { type: String },
  createdAt: { type: Date, expires: 30 * 60, default: Date.now },
});

const passwordResetToken = mongoose.model('password_reset_token', passwordResetTokenSchema);
module.exports = passwordResetToken;
