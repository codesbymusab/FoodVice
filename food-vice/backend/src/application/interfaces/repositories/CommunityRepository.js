class CommunityRepository {
  async create(communityData) {
    throw new Error('Not Implemented')
  }

  async addMember(memberData) {
    throw new Error('Not Implemented')
  }

  async findByName(name) {
    throw new Error('Not Implemented')
  }

  async findRecommendedCommunities(userId) {
    throw new Error('Not Implemented')
  }

  async findById(id) {
    throw new Error('Not Implemented')
  }

  async findJoinedByUser(userId) {
    throw new Error('Not Implemented')
  }

  async isMember(userId, communityId) {
    throw new Error('Not Implemented')
  }
}

module.exports = CommunityRepository;
