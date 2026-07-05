export default interface IReportRepository {
  createReport(report: unknown): Promise<unknown>;

  getReports(params?: { status?: string; assignedTo?: string; page?: number; limit?: number }): Promise<unknown>;

  assignReport(reportId: string, assignedTo: string): Promise<unknown>;

  resolveReport(reportId: string, resolution: string, escalate: boolean): Promise<unknown>;

  escalateReport(reportId: string): Promise<unknown>;
}
