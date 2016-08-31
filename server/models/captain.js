// Captain model

import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const captainSchema = new Schema({
  current_level: Number,
  current_sockets: [{
    _socket: { type: Number, min: 0, max: 10, ref: 'Socket' },
    socket_level: { type: Number, min: 1, max: 5 },
  }],
  current_special_level: Number,
  current_hp_ccs: { type: Number, min: 0, max: 100 },
  current_atk_ccs: { type: Number, min: 0, max: 100 },
  current_rcv_ccs: { type: Number, min: 0, max: 100 },
  _unit: { type: Number, min: 0, ref: 'Unit' },
  _user: { type: Schema.Types.ObjectId, ref: 'User' },
  _account: { type: Schema.Types.ObjectId, ref: 'Account' },
  region: { type: String, enum: ['global', 'japan'], required: true },
});

export default mongoose.model('Captain', captainSchema);
