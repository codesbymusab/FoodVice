// 
import IReportRepository from '../../../../application/interfaces/repositories/ReportRepository'
const Report = require('../models/Reports/ReportModel');
const mongoose = require('mongoose');

class ReportRepoImpl implements IReportRepository {
  async createReport(report: unknown): Promise<unknown> {
    return await Report.create(report);
  }

  async getReports ({ status,assignedTo,page = 1,limit = 20}:{ status?: string; assignedTo?: string; page?: number; limit?: number }): Promise<unknown>{
    const query = {};
    if (status) (query as any).status = status;
    if (assignedTo) (query as any).assignedTo = new mongoose.Types.ObjectId(assignedTo);

    return await Report.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();
  }

  async assignReport(reportId:string, assignedTo:string) {
    return await Report.findByIdAndUpdate(
      reportId,
      { assignedTo: new mongoose.Types.ObjectId(assignedTo), status: 'open' },
      { new: true }
    ).lean();
  }

  async resolveReport(reportId:string, resolution:string, escalate:boolean): Promise<unknown> {
    return await Report.findByIdAndUpdate(
      reportId,
      {
        status: escalate ? 'escalated' : 'resolved',
        details: resolution || undefined,
        updatedAt: new Date()
      },
      { new: true }
    ).lean();
  }

  async escalateReport(reportId: string): Promise<unknown> {
    return await Report.findByIdAndUpdate(
      reportId,
      { status: 'escalated', updatedAt: new Date() },
      { new: true }
    ).lean();
  }
}

export default ReportRepoImpl;
