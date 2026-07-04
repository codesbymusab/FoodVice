const mongoose = require('mongoose')

const ReviewSchema = new mongoose.Schema({
  uid: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
  text: String,
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

module.exports = mongoose.model('Review', ReviewSchema);