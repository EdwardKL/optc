// Special model
import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const captainAbilitySchema = new Schema({
  _id: { type: Number },
  description: { type: String },
});

const CaptainAbility = mongoose.model('captain_abilities', captainAbilitySchema);
module.exports = CaptainAbility;
