class RestaurantRepository {
  async getRecommended(location, filters, userId, cursor, limit = 5) {
    throw new Error('Not Implemented')
  }

  async getTopRated(location, filters, userId, cursor, limit = 10) {
    throw new Error('Not Implemented')
  }

  async getNearby(location, filters, userId, limitCount = 5) {
    throw new Error('Not Implemented')
  }

  async getById(id) {
    throw new Error('Not Implemented')
  }

  async getLocation(locationId, from) {
    throw new Error('Not Implemented')
  }

  async getOpeningHours(id) {
    throw new Error('Not Implemented')
  }

  async getCuisines(restId) {
    throw new Error('Not Implemented')
  }

  async getLabels(id) {
    throw new Error('Not Implemented')
  }

  async getSimilarRestaurants(id) {
    throw new Error('Not Implemented')
  }

  async getSavedRestaurants(userId, limit = 5) {
    throw new Error('Not Implemented')
  }

  async getTrending({ userId = null, limit = 6, location = null, maxDistance = 50 }) {
    throw new Error('Not Implemented')
  }

  async getAll(filters = {}, page = 1, limit = 20) {
    throw new Error('Not Implemented')
  }

  async createRestaurant(payload) {
    throw new Error('Not Implemented')
  }

  async updateRestaurant(id, payload) {
    throw new Error('Not Implemented')
  }

  async deleteRestaurant(id) {
    throw new Error('Not Implemented')
  }
}

module.exports = RestaurantRepository;
