class ReportRepository {
  async createReport(report) {
    throw new Error('Not Implemented')
  }

  async getReports({ status, assignedTo, page = 1, limit = 20 } = {}) {
    throw new Error('Not Implemented')
  }

  async assignReport(reportId, assignedTo) {
    throw new Error('Not Implemented')
  }

  async resolveReport(reportId, resolution, escalate) {
    throw new Error('Not Implemented')
  }

  async escalateReport(reportId) {
    throw new Error('Not Implemented')
  }
}

module.exports = ReportRepository;
