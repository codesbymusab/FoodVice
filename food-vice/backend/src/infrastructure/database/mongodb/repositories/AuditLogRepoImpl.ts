// @ts-nocheck
import IAuditLogRepository from '../../../../application/interfaces/repositories/AuditLogRepository'
const AuditLog = require('../models/AuditLogModel');

class AuditLogRepoImpl implements IAuditLogRepository {
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

export default AuditLogRepoImpl;
