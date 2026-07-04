class GetJoinedCommunities {
  constructor(communityRepo) {
    this.communityRepo = communityRepo;
  }

  async execute({ userId }) {
    return await this.communityRepo.findJoinedByUser(userId);
  }
}

module.exports = GetJoinedCommunities;
