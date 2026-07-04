const Community = require('../models/Community/CommunityModel');
const CommunityMember = require('../models/Community/CommunityMemberModel');
const { default: mongoose } = require('mongoose');

class CommunityRepoImpl {
  async create(communityData) {
    const community = new Community(communityData);
    return await community.save();
  }

  async addMember(memberData) {
    const member = new CommunityMember(memberData);
    return await member.save();
  }

  async findByName(name) {
    const query = name ? { name: { $regex: name, $options: 'i' } } : {};
    return await Community.find(query);
  }
  
  async findRecommendedCommunities(userId) {
    return await Community.aggregate([
      {
        $lookup: {
          from: "communitymembers",
          localField: "_id",
          foreignField: "communityId",
          as: "result"
        }
      },
      {
        $unwind: {
          path: "$result",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $match: {
          "result.userId": { $ne: new mongoose.Types.ObjectId(userId) }
        }
      },
      {
        $project: {
          _id: 1,
          name: 1,
          coverPhoto: 1
        }
      }
    ]).exec()
  }

  async findById(id) {
    return await Community.findById(id);
  }

  async findJoinedByUser(userId) {
    const memberships = await CommunityMember.find({ userId }).populate('communityId', 'name coverPhoto');
    return memberships.map(m => m.communityId);
  }

  async isMember(userId, communityId) {
    const membership = await CommunityMember.findOne({ userId, communityId });
    return !!membership;
  }
}

module.exports = CommunityRepoImpl;
