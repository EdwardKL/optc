// Import mongoose.
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create the socket schema.
const recommendationSchema = new Schema({
  _unit: { type: Number, min: 0, ref: 'Unit' },
  _user: { type: Schema.Types.ObjectId, ref: 'User' },
  recommended: { type: Boolean, default: false },
});

// Create the model.
const Recommendation = mongoose.model('Recommendation', recommendationSchema);

// Make the model available to Node users.
module.exports = Recommendation;
