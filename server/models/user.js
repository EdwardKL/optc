// User model

import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: 'String', required: true },
  pirate_lvl: { type: 'Number' },
  user_id: { type: 'Number', required: true },
});


export default mongoose.model('User', userSchema);
