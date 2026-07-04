class GetCommunities {
  constructor(communityRepo) {
    this.communityRepo = communityRepo;
  }

  async execute({ name }) {
    return await this.communityRepo.findByName(name);
  }
}

module.exports = GetCommunities;
