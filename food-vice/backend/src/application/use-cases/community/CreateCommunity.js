class CreateCommunity {
  constructor(communityRepo, storageService) {
    this.communityRepo = communityRepo;
    this.storageService = storageService;
  }

  async execute({ name, description, guidelines, file, userId }) {
    let coverPhoto = null;
    
    if (file) {
      coverPhoto = await this.storageService.uploadFile(file, 'communities/covers');
    }

    const community = await this.communityRepo.create({
      name,
      description,
      guidelines,
      coverPhoto,
      createdBy: userId
    });

    // Auto-join the creator
    await this.communityRepo.addMember({
      userId,
      communityId: community._id,
      role: 'admin'
    });

    return community;
  }
}

module.exports = CreateCommunity;
