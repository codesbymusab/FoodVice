const Report = require('../models/Reports/ReportModel');
const mongoose = require('mongoose');

class ReportRepoImpl {
  async createReport(report) {
    return await Report.create(report);
  }

  async getReports({ status, assignedTo, page = 1, limit = 20 } = {}) {
    const query = {};
    if (status) query.status = status;
    if (assignedTo) query.assignedTo = new mongoose.Types.ObjectId(assignedTo);

    return await Report.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();
  }

  async assignReport(reportId, assignedTo) {
    return await Report.findByIdAndUpdate(
      reportId,
      { assignedTo: new mongoose.Types.ObjectId(assignedTo), status: 'open' },
      { new: true }
    ).lean();
  }

  async resolveReport(reportId, resolution, escalate) {
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

  async escalateReport(reportId) {
    return await Report.findByIdAndUpdate(
      reportId,
      { status: 'escalated', updatedAt: new Date() },
      { new: true }
    ).lean();
  }
}

module.exports = ReportRepoImpl;
