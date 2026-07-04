const mongoose=require('mongoose')

const UserReputationSchema = new mongoose.Schema({
  uid: { type:mongoose.Schema.Types.ObjectId, ref: 'User' },
  points: { type: Number, default: 0 },
  badge: String
});

module.exports = mongoose.model('UserReputation', UserReputationSchema);