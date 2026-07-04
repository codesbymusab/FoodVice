class GetThreadQueue {
    constructor(threadRepo) {
        this.threadRepo = threadRepo;
    }

    async execute({ page, limit, status, search  }) {
        return await this.threadRepo.getPending(limit, { status, search });
    }
}

module.exports = GetThreadQueue;