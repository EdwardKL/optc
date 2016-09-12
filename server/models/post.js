import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const postSchema = new Schema({
  _user: { type: Schema.Types.ObjectId, ref: 'User' },
  _parent: { type: Schema.Types.ObjectId, ref: 'Post' },
  content: { type: 'String', required: true },
  date_added: { type: 'Date', default: Date.now, required: true },
  location: { type: 'String', required: true },
  score: { type: Number, default: 0, required: true },
});

export default mongoose.model('Post', postSchema);
