class GetAuditLogs {
    constructor(auditLogRepo) {
        this.auditLogRepo = auditLogRepo;
    }

    async execute({ page = 1, limit = 20 }) {
        return await this.auditLogRepo.getPaginated({ page, limit });
    }
}

module.exports = GetAuditLogs;