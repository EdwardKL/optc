// User model

import Captain from './captain';
import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const userSchema = new Schema({
  _id: { type: Schema.Types.ObjectId },
  username: { type: 'String', required: true },
  password: { type: 'String', required: true },
  pirate_lvl: { type: 'Number' },
  user_id: { type: 'Number', required: true },
  captains: [Captain],
  date_created: { type: 'Date', default: Date.now },
  last_login: { type: 'Date' }
});

export default mongoose.model('User', userSchema);
