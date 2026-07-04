class FlagReview {
    constructor(reviewRepo, auditService) {
        this.reviewRepo = reviewRepo;
        this.auditService = auditService;
    }

    async execute({ reviewId, userId, userRole, reason }) {
        const review = await this.reviewRepo.flagReview(reviewId, userId, reason);

        if (!review) {
            throw new Error('Review not found');
        }

        await this.auditService.logAction(userId, userRole, 'flag_review', 'review', reviewId, { reason });
        return review;
    }
}

module.exports = FlagReview;