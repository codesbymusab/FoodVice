import { ResolveReportDTO } from "../../dtos/input/Moderation/ModerationDTO";
import IReportRepository from "../../interfaces/repositories/ReportRepository";
import IAuditService from "../../interfaces/services/AuditService";

export default class ResolveReport {
    constructor(
        private readonly reportRepo: IReportRepository,
        private readonly auditService: IAuditService,
    ) { }

    async execute({ resolution, escalateToAdmin }: ResolveReportDTO, { reportId, userId, userRole }: { reportId: string; userId: string; userRole: string }) {
        const report = await this.reportRepo.resolveReport(reportId, resolution, Boolean(escalateToAdmin));
        if (!report) {
            throw new Error("Report not found");
        }

        await this.auditService.logAction(userId, userRole, escalateToAdmin ? "escalate_report" : "resolve_report", "report", reportId, { resolution });
        return report;
    }
}
