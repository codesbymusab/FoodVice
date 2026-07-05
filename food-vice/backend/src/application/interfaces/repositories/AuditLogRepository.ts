export default interface IAuditLogRepository {
  createLog(logEntry: unknown): Promise<unknown>;

  getPaginated(params?: { page?: number; limit?: number }): Promise<unknown>;
}
