const mongoose = require('mongoose');

const CommunityMemberSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  communityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Community' },
  role: { type: String, default: 'member' }
});

module.exports = mongoose.model('CommunityMember', CommunityMemberSchema);
