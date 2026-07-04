const mongoose = require('mongoose');

const ThreadCommentSchema = new mongoose.Schema({
  uid: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  threadId: { type: mongoose.Schema.Types.ObjectId, ref: 'Thread' },
  content: { type: String, required: true },
  media: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Media' }],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] }]
}, { timestamps: true });

module.exports = mongoose.model('ThreadComment', ThreadCommentSchema);