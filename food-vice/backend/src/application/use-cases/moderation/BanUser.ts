import { BanUserDTO } from "../../dtos/input/Moderation/ModerationDTO";
import { IUserRepository } from "../../interfaces/repositories/UserRepository";
import IAuditService from "../../interfaces/services/AuditService";

export default class BanUser {
    constructor(
        private readonly userRepo: IUserRepository,
        private readonly auditService: IAuditService,
    ) { }

    async execute({ reason, until }: BanUserDTO, { targetId, userId, userRole }: { targetId: string; userId: string; userRole: string }) {
        if (!reason) {
            throw new Error("Ban reason is required");
        }

        const user = await this.userRepo.banUser(targetId, reason, until ? new Date(until) : new Date());
        if (!user) {
            throw new Error("User not found");
        }

        await this.auditService.logAction(userId, userRole, "ban_user", "user", targetId, { reason, until });
        return user;
    }
}
