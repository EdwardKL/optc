// Import mongoose.
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Create the socket schema.
var socketSchema = new Schema({
  _id: Number,
  name: String
});

// Create the model.
var Socket = mongoose.model('Socket', unitSchema);

// Make the model available to Node users.
module.exports = Socket;
