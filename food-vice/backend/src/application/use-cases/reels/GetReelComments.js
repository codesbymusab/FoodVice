class GetReelComments {
  constructor(commentRepo) {
    this.commentRepo = commentRepo; 
  }

  async execute({ reelId, userId, limit = 20 }) {
    return await this.commentRepo.findByReelWithLikes(reelId, userId, limit);
  }
}

module.exports = GetReelComments
