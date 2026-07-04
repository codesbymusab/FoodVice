class GetPopularTags{
  constructor(reelRepo) {
    this.reelRepo = reelRepo
  }

  async execute({ limit }) {
    return await this.reelRepo.getPopularTags(limit);
  }
}

module.exports = GetPopularTags;
