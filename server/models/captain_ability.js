// Special model
import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const captainAbilitySchema = new Schema({
  _id: { type: Number },
  description: { type: String },
});

const CaptainAbility = mongoose.model('CaptainAbility', captainAbilitySchema);
module.exports = CaptainAbility;
