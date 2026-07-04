class LikeReelComment {
  constructor(likeRepo) {
    this.likeRepo = likeRepo;
  }

  async execute({ commentId, userId }) {
    if (!commentId || !userId) {
      throw new Error("commentId and userId are required");
    }
    return await this.likeRepo.toggleReelCommentLike(commentId, userId);
  };


}

module.exports = LikeReelComment