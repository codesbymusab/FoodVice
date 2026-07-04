class CommentRepository {
  async findByReelWithLikes(reelId, userId, limit = 20) {
    throw new Error('Not Implemented')
  }

  async createComment(reelId, userId, text) {
    throw new Error('Not Implemented')
  }
}

module.exports = CommentRepository;
