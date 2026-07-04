class PostReelComment {
  constructor(commentRepo) {
    this.commentRepo = commentRepo;
  }

  async execute({ reelId, userId, text }) {
    if (!text || !text.trim()) {
      throw new Error("Comment text cannot be empty");
    }

    return await this.commentRepo.createComment(reelId, userId, text);
  }
}

module.exports = PostReelComment;
