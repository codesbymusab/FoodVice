class UserRepository {
  async getByEmail(email) {
    throw new Error('Not Implemented')
  }

  async findById(userId) {
    throw new Error('Not Implemented')
  }

  async getById(userId) {
    throw new Error('Not Implemented')
  }

  async getProfile(userId) {
    throw new Error('Not Implemented')
  }

  async getUsers({ role } = {}) {
    throw new Error('Not Implemented')
  }

  async setRole(userId, role) {
    throw new Error('Not Implemented')
  }

  async banUser(userId, reason, until) {
    throw new Error('Not Implemented')
  }

  async unbanUser(userId) {
    throw new Error('Not Implemented')
  }

  async create(user) {
    throw new Error('Not Implemented')
  }

  async update(user, data) {
    throw new Error('Not Implemented')
  }

  async delete(user) {
    throw new Error('Not Implemented')
  }

  async follow(followerId, followingId) {
    throw new Error('Not Implemented')
  }
}

module.exports = UserRepository;
