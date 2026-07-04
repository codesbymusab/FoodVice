const AuditLog = require('../models/AuditLogModel');

class AuditLogRepoImpl {
  async createLog(logEntry) {
    return await AuditLog.create(logEntry);
  }

  async getPaginated({ page, limit } = {}) {
    return await AuditLog.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();
  }
}

module.exports = AuditLogRepoImpl;
