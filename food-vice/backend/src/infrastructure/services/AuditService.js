const AuditLogRepoImpl = require('../database/mongodb/repositories/AuditLogRepoImpl');

class AuditService {
  constructor(auditLogRepo = new AuditLogRepoImpl()) {
    this.auditLogRepo = auditLogRepo;
  }

  async logAction(actorId, actorRole, action, targetType, targetId, metadata = {}) {
    return await this.auditLogRepo.createLog({
      actorId,
      actorRole,
      action,
      targetType,
      targetId,
      metadata,
      createdAt: new Date()
    });
  }
}

module.exports = AuditService;
