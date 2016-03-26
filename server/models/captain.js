// Captain model

import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const captainSchema = new Schema({
  current_level: Schema.Types.Number,
  current_sockets: [{
	socket_id: { type: Number, min: 0, max: 10 },
	socket_level: { type: Number, min: 1, max: 5 }
  }],
  current_special_level: Schema.Types.Number,
  unit_id: { type: Number, min: 0 },
  _user: { type: Schema.Types.ObjectId, ref: 'User'}
});

export default mongoose.model('Captain', captainSchema);
