// Import mongoose.
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create the schema.
const postVoteSchema = new Schema({
  _user: { type: Schema.Types.ObjectId, ref: 'User' },
  _post: { type: Schema.Types.ObjectId, ref: 'Post' },
  upvote: { type: Boolean, default: false },
});

const PostVote = mongoose.model('PostVote', postVoteSchema);

module.exports = PostVote;
