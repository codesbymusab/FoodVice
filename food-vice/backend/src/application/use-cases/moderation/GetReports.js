class GetReports {
    constructor(reportRepo) {
        this.reportRepo = reportRepo;
    }

    async execute({ status, assignedTo, page, limit}) {
        return await this.reportRepo.getReports({ status, assignedTo, page, limit });
    }
}

module.exports = GetReports;