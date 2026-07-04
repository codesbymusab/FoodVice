class ResolveReport {
    constructor(reportRepo, auditService) {
        this.reportRepo = reportRepo;
        this.auditService = auditService;
    }

    async execute({ reportId, resolution, escalateToAdmin, userId, userRole }) {
        const report = await this.reportRepo.resolveReport(reportId, resolution, Boolean(escalateToAdmin));
        if (!report) {
            throw new Error('Report not found');
        }

        await this.auditService.logAction(userId, userRole, escalateToAdmin ? 'escalate_report' : 'resolve_report', 'report', reportId, { resolution });
        return report;
    }
}

module.exports = ResolveReport;