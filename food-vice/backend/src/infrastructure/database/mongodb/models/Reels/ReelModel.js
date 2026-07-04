const mongoose = require('mongoose')

const ReelSchema = new mongoose.Schema({
  uid: { type:mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: String,
  description: String,
  views: { type: Number, default: 0 },
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "ReelTag" }]
}, { timestamps: true });

module.exports = mongoose.model('Reel', ReelSchema);