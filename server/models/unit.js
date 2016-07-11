// Import mongoose.
import mongoose from 'mongoose';
var Schema = mongoose.Schema;

// Create the unit schema.
var unitSchema = new Schema({
  _id: Number,
  name: String,
  type: { type: String, enum: ['STR', 'DEX', 'QCK', 'INT', 'PSY'] },
  classes: [{ type: String, enum: ['Fighter', 'Freedom', 'Slasher', 'Ambition', 'Striker', 'Knowledge', 'Shooter', 'Tough', 'Evolver', 'Booster'] }],
  stars: { type: Number, min: 1, max: 6 },
  cost: { type: Number, min: 1, max: 55 },
  combo: { type: Number, min: 4, max: 10 },
  slots: { type: Number, min: 0, max: 5 },
  max_level: { type: Number, min: 1, max: 99 },
  max_exp: { type: Number, min: 0, max: 5000000 },
  base_hp: { type: Number, min: 20, max: 4000 },
  base_atk: { type: Number, min: 10, max: 1600 },
  base_rcv: { type: Number, min: -999, max: 600 },
  max_hp: { type: Number, min: 20, max: 4000 },
  max_atk: { type: Number, min: 10, max: 1600 },
  max_rcv: { type: Number, min: -999, max: 600 },
  captain_ability: { type: Number, min: 0, ref: 'CaptainAbility' },
  special_ability: { type: Number, min: 0, ref: 'Special' },
  region: { type: String, enum: ['all', 'japan'] },
});

// Create the model.
var Unit = mongoose.model('Unit', unitSchema);

// Make the model available to Node users.
module.exports = Unit;
