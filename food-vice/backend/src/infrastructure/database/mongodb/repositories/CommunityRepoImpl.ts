
import ICommunityRepository from '../../../../application/interfaces/repositories/CommunityRepository'
const Community = require('../models/Community/CommunityModel');
const CommunityMember = require('../models/Community/CommunityMemberModel');
const { default: mongoose } = require('mongoose');

class CommunityRepoImpl implements ICommunityRepository {
  async create(communityData: unknown): Promise<unknown> {
    const community = new Community(communityData);
    return await community.save();
  }

  async addMember(memberData: unknown): Promise<unknown> {
    const member = new CommunityMember(memberData);
    return await member.save();
  }

  async findByName(name: string): Promise<unknown>{
    const query = name ? { name: { $regex: name, $options: 'i' } } : {};
    return await Community.find(query);
  }
  
  async findRecommendedCommunities(userId: string): Promise<unknown> {
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

  async findById(id: string): Promise<unknown> {
    return await Community.findById(id);
  }

  async findJoinedByUser(userId: string): Promise<unknown> {
    const memberships = await CommunityMember.find({ userId }).populate('communityId', 'name coverPhoto');
    return memberships.map((m:any) => m.communityId);
  }

  async isMember(userId: string, communityId: string): Promise<unknown> {
    const membership = await CommunityMember.findOne({ userId, communityId });
    return !!membership;
  }
}

export default CommunityRepoImpl;
