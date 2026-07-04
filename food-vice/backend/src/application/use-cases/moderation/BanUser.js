class BanUser {
    constructor(userRepo, auditService) {
        this.userRepo = userRepo;
        this.auditService = auditService;
    }

    async execute({ targetId, reason, until, userId, userRole }) {
        if (!reason) {
            throw new Error('Ban reason is required');
        }

        const user = await this.userRepo.banUser(targetId, reason, until ? new Date(until) : null);
        if (!user) {
            throw new Error('User not found');
        }

        await this.auditService.logAction(userId, userRole, 'ban_user', 'user', targetId, { reason, until });
        return user;
    }
}

module.exports = BanUser;