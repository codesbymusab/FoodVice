const mongoose=require('mongoose')

const ReelLikeSchema = new mongoose.Schema({
  uid: { type:mongoose.Schema.Types.ObjectId, ref: 'User' },
  reelId: { type:mongoose.Schema.Types.ObjectId, ref: 'Reel' }
});
ReelLikeSchema.index({ uid: 1, reelId: 1 }, { unique: true });

module.exports = mongoose.model('ReelLike', ReelLikeSchema);