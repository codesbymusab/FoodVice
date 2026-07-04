class GetReviewQueue {
    constructor(reviewRepo) {
        this.reviewRepo = reviewRepo;
    }

    async execute({ page, limit, status, search }) {
        return await this.reviewRepo.getPending(limit, { status, search });
    }
}

module.exports = GetReviewQueue;