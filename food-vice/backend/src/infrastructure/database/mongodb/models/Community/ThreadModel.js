const mongoose = require('mongoose');

const ThreadSchema = new mongoose.Schema({
  uid: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  communityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Community', required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  views: { type: Number, default: 0 },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  topics: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Topic' }],
  media: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Media' }],
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'hidden'],
    default: 'pending'
  },
  flags: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      reason: String,
      createdAt: { type: Date, default: Date.now }
    }
  ],
  moderationNotes: [
    {
      moderatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      note: String,
      action: { type: String, enum: ['approve', 'reject', 'hide', 'warn'] },
      createdAt: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Thread', ThreadSchema);