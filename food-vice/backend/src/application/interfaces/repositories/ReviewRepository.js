class ReviewRepository {
  async getCountByUserId(userId) {
    throw new Error('Not Implemented')
  }

  async getCountByRestId(restId) {
    throw new Error('Not Implemented')
  }

  async getRestaurantRating(restId) {
    throw new Error('Not Implemented')
  }

  async getReviews({ restId, userId, cursor, limit = 3, currentUser = false }) {
    throw new Error('Not Implemented')
  }

  async getRecentReviews({ userId, cursor, limit = 3, currentUser = false }) {
    throw new Error('Not Implemented')
  }

  async createReview({ userId, restaurantId, text }) {
    throw new Error('Not Implemented')
  }

  async createRating({ reviewId, food, service, ambience, price, overall }) {
    throw new Error('Not Implemented')
  }

  async getPending(limit = 20, filters = {}) {
    throw new Error('Not Implemented')
  }

  async flagReview(reviewId, userId, reason) {
    throw new Error('Not Implemented')
  }

  async moderateReview(reviewId, moderatorId, action, note) {
    throw new Error('Not Implemented')
  }
}

module.exports = ReviewRepository;
