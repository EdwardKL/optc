import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const accountSchema = new Schema({
  region: { type: String, enum: ['global', 'japan'] },
  crew_name: { type: String },
  friend_id: { type: Number, min: 100000000, max: 999999999 },
  pirate_level: { type: Number, min: 1 },
  _captains: [{ type: Schema.Types.ObjectId, ref: 'Captain' }],
});

const Account = mongoose.model('Account', accountSchema);
module.exports = Account;