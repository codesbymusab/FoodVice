class UnbanUser {
    constructor(userRepo, auditService) {
        this.userRepo = userRepo;
        this.auditService = auditService;
    }

    async execute({ targetId, userId, userRole }) {
        const user = await this.userRepo.unbanUser(targetId);
        if (!user) {
            throw new Error('User not found');
        }

        await this.auditService.logAction(userId, userRole, 'unban_user', 'user', targetId, {});
        return user;
    }
}

module.exports = UnbanUser;