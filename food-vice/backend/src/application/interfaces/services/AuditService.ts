export default interface IAuditService {
  logAction(actorId: string, actorRole: string, action: string, targetType: string, targetId: string, metadata?: Record<string, unknown>): Promise<unknown>;
}
