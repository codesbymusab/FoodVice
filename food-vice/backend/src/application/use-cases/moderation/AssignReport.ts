import { AssignReportDTO } from "../../dtos/input/Moderation/ModerationDTO";
import IReportRepository from "../../interfaces/repositories/ReportRepository";
import IAuditService from "../../interfaces/services/AuditService";

export default class AssignReport {
    constructor(
        private readonly reportRepo: IReportRepository,
        private readonly auditService: IAuditService,
    ) { }

    async execute(dto: AssignReportDTO, { reportId, userId, userRole }: { reportId: string; userId: string; userRole: string }) {


        const report = await this.reportRepo.assignReport(reportId, dto.assignedTo);
        if (!report) {
            throw new Error("Report not found");
        }

        await this.auditService.logAction(userId, userRole, "assign_report", "report", reportId, { assignedTo: dto.assignedTo });
        return report;
    }
}
