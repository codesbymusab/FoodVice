import { IUserRepository } from "../../interfaces/repositories/UserRepository";
import IAuditService from "../../interfaces/services/AuditService";

export default class UnbanUser {
    constructor(
        private readonly userRepo: IUserRepository,
        private readonly auditService: IAuditService,
    ) { }

    async execute({ targetId, userId, userRole }: { targetId: string; userId: string; userRole: string }) {
        const user = await this.userRepo.unbanUser(targetId);
        if (!user) {
            throw new Error("User not found");
        }

        await this.auditService.logAction(userId, userRole, "unban_user", "user", targetId, {});
        return user;
    }
}
