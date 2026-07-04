const mongoose=require('mongoose')

const ReviewLikeSchema = new mongoose.Schema({
  uid: { type:mongoose.Schema.Types.ObjectId, ref: 'User' },
  reviewId: { type:mongoose.Schema.Types.ObjectId, ref: 'Review' }
});

ReviewLikeSchema.index({ uid: 1, reviewId: 1 }, { unique: true });

module.exports = mongoose.model('ReviewLike', ReviewLikeSchema);