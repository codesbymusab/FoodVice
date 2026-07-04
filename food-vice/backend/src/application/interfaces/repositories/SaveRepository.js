class SaveRepository {
  async saveRestaurant({ userId, restId }) {
    throw new Error('Not Implemented')
  }

  async unsaveRestaurant(id) {
    throw new Error('Not Implemented')
  }

  async getByRestId({ restId, userId }) {
    throw new Error('Not Implemented')
  }

  async saveReel({ userId, reelId }) {
    throw new Error('Not Implemented')
  }

  async unsaveReel(id) {
    throw new Error('Not Implemented')
  }

  async getByReelId({ reelId, userId }) {
    throw new Error('Not Implemented')
  }
}

module.exports = SaveRepository;
