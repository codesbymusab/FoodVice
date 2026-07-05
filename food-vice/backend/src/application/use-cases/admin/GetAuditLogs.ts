import IAuditLogRepository from "../../interfaces/repositories/AuditLogRepository";

export default class GetAuditLogs {
  constructor(private readonly auditLogRepo: IAuditLogRepository) {}

  async execute({ page = 1, limit = 20 }: { page?: number; limit?: number }) {
    return await this.auditLogRepo.getPaginated({ page, limit });
  }
}
