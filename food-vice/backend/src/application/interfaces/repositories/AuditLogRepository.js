class AuditLogRepository {
  async createLog(logEntry) {
    throw new Error('Not Implemented')
  }

  async getPaginated({ page = 1, limit = 20 } = {}) {
    throw new Error('Not Implemented')
  }
}

module.exports = AuditLogRepository;
