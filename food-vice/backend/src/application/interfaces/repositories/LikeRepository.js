class LikeRepository {
  async likeReview({ userId, reviewId }) {
    throw new Error('Not Implemented')
  }

  async unlikeReview(id) {
    throw new Error('Not Implemented')
  }

  async getByReviewId({ reviewId, userId }) {
    throw new Error('Not Implemented')
  }

  async likeReel({ userId, reelId }) {
    throw new Error('Not Implemented')
  }

  async unlikeReel(id) {
    throw new Error('Not Implemented')
  }

  async getByReelId({ reelId, userId }) {
    throw new Error('Not Implemented')
  }

  async toggleReelCommentLike(commentId, userId) {
    throw new Error('Not Implemented')
  }
}

module.exports = LikeRepository;
