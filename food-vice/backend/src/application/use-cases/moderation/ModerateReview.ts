import { ModerateReviewDTO } from "../../dtos/input/Moderation/ModerationDTO";
import IReviewRepository from "../../interfaces/repositories/ReviewRepository";
import IAuditService from "../../interfaces/services/AuditService";

export default class ModerateReview {
    constructor(
        private readonly reviewRepo: IReviewRepository,
        private readonly auditService: IAuditService,
    ) { }

    async execute({ action, note }: ModerateReviewDTO, { reviewId, userId, userRole, }: { reviewId: string; userId: string; userRole: string }) {
        const validActions = ["approve", "reject", "hide"];
        if (!validActions.includes(action)) {
            throw new Error("Invalid moderation action");
        }

        const review = await this.reviewRepo.moderateReview(reviewId, userId, action, note ?? "");
        if (!review) {
            throw new Error("Review not found");
        }

        await this.auditService.logAction(userId, userRole, `${action}_review`, "review", reviewId, { note });
        return review;
    }
}
