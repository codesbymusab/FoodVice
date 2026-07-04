class AssignReport {
    constructor(reportRepo, auditService) {
        this.reportRepo = reportRepo;
        this.auditService = auditService;
    }

    async execute({ reportId, assignedTo, userId, userRole }) {
        if (!assignedTo) {
            throw new Error('assignedTo is required');
        }

        const report = await this.reportRepo.assignReport(reportId, assignedTo);
        if (!report) {
            throw new Error('Report not found');
        }

        await this.auditService.logAction(userId, userRole, 'assign_report', 'report', reportId, { assignedTo });
        return report;
    }
}

module.exports = AssignReport;