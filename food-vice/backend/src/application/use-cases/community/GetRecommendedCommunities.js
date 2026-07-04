class GetRecommendedCommunities {
  constructor(communityRepo) {
    this.communityRepo = communityRepo;
  }

  async execute({ userId }) {
    if(!userId) throw new Error('UserId required')
    return await this.communityRepo.findRecommendedCommunities(userId);
  }
}

module.exports = GetRecommendedCommunities;
