class JoinCommunity {
  constructor(communityRepo) {
    this.communityRepo = communityRepo;
  }

  async execute({ userId, communityId }) {
    const alreadyMember = await this.communityRepo.isMember(userId, communityId);
    if (alreadyMember) {
      throw new Error('Already a member of this community');
    }

    return await this.communityRepo.addMember({
      userId,
      communityId,
      role: 'member'
    });
  }
}

module.exports = JoinCommunity;
