import { FlagReviewDTO } from "../../dtos/input/Moderation/ModerationDTO";
import IReviewRepository from "../../interfaces/repositories/ReviewRepository";
import IAuditService from "../../interfaces/services/AuditService";

export default class FlagReview {
    constructor(
        private readonly reviewRepo: IReviewRepository,
        private readonly auditService: IAuditService,
    ) { }

    async execute({ reason }: FlagReviewDTO, { reviewId, userId, userRole }: { reviewId: string; userId: string; userRole: string }) {
        const review = await this.reviewRepo.flagReview(reviewId, userId, reason);

        if (!review) {
            throw new Error("Review not found");
        }

        await this.auditService.logAction(userId, userRole, "flag_review", "review", reviewId, { reason });
        return review;
    }
}
