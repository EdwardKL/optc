// Captain model

import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const captainSchema = new Schema({
  current_level: Schema.Types.Number,
  current_special_level: Schema.Types.Number,
  user_id: { type: Schema.Types.ObjectId, ref: 'User'}
});

export default mongoose.model('Captain', captainSchema);
