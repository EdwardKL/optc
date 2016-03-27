// Captain model

import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const captainSchema = new Schema({
  current_level: Number,
  current_sockets: [{
	  _socket: { type: Number, min: 0, max: 10, ref: 'Socket' },
	  socket_level: { type: Number, min: 1, max: 5 }
  }],
  current_special_level: Number,
  _unit: { type: Number, min: 0, ref: 'Unit' },
  _user: { type: Schema.Types.ObjectId, ref: 'User'}
});

export default mongoose.model('Captain', captainSchema);
