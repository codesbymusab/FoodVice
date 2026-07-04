class ModerateReview {
    constructor(reviewRepo, auditService) {
        this.reviewRepo = reviewRepo;
        this.auditService = auditService;
    }

    async execute({ reviewId, userId, userRole, action, note }) {
        const validActions = ['approve', 'reject', 'hide'];
        if (!validActions.includes(action)) {
            throw new Error('Invalid moderation action');
        }

        const review = await this.reviewRepo.moderateReview(reviewId, userId, action, note);
        if (!review) {
            throw new Error('Review not found');
        }

        await this.auditService.logAction(userId, userRole, `${action}_review`, 'review', reviewId, { note });
        return review;
    }
}

module.exports = ModerateReview;