class AuditService {
  async logAction(actorId, actorRole, action, targetType, targetId, metadata = {}) {
    throw new Error('Not Implemented')
  }
}

module.exports = AuditService;
