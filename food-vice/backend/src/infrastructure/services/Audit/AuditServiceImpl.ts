// @ts-nocheck
import IAuditService from '../../../application/interfaces/services/AuditService'
import AuditLogRepoImpl from '../../database/mongodb/repositories/AuditLogRepoImpl';


class AuditService implements IAuditService {
  constructor() {
    this.auditLogRepo = new AuditLogRepoImpl()
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

export default AuditService;
