const mongoose=require('mongoose')

const ReelCommentSchema = new mongoose.Schema({
  uid: { type:mongoose.Schema.Types.ObjectId, ref: 'User' },
  rid: { type:mongoose.Schema.Types.ObjectId, ref: 'Reel' },
  text: String
}, { timestamps: true });

module.exports = mongoose.model('ReelComment', ReelCommentSchema);
