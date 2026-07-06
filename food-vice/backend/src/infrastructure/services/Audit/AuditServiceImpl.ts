import IAuditService from '../../../application/interfaces/services/AuditService'
import AuditLogRepoImpl from '../../database/mongodb/repositories/AuditLogRepoImpl';


class AuditService implements IAuditService {
  
  private auditLogRepo = new AuditLogRepoImpl();
  

  async logAction(actorId:string, actorRole:string, action:string, targetType:string, targetId:string, metadata = {}) {
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
