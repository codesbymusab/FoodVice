const mongoose=require('mongoose')

const ReelSaveSchema = new mongoose.Schema({
  uid: { type:mongoose.Schema.Types.ObjectId, ref: 'User' },
  reelId: { type:mongoose.Schema.Types.ObjectId, ref: 'ReelTag' }
});
ReelSave.index({ uid: 1, rid: 1 }, { unique: true });

module.exports = mongoose.model('ReelSave', ReelSaveSchema);