// Special model
import mongoose from 'mongoose';
var crypto = require('crypto');

const Schema = mongoose.Schema;

const specialSchema = new Schema({
  _id: { type: Number },
  subspecials: [{
    name: { type: String },
    stages: [{
      description: { type: String },
      base_cd: { type: Number },
      max_cd: { type: Number },
    }],
    region: { type: String, enum: ['global', 'japan', 'all'] },
    notes: { type: String },
  }],
});

var Special = mongoose.model('Special', specialSchema);
module.exports = Special;

