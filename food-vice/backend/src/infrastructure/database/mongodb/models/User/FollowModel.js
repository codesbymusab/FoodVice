const mongoose = require('mongoose')

const FollowersSchema = new mongoose.Schema({
  followerId: { type:mongoose.Schema.Types.ObjectId, ref: 'User' },
  followingId: { type:mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

FollowersSchema.index({ followerId: 1, followingId: 1 }, { unique: true });

module.exports = mongoose.model('Followers', FollowersSchema);