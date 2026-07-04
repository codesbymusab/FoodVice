const { UserRoles } = require('../../../shared/utils/moderationConstants');

class SetUserRole {
    constructor(userRepo, auditService) {
        this.userRepo = userRepo;
        this.auditService = auditService;
    }

    async execute({ userId, role, currentUserId, currentUserRole }) {
        if (!role || !Object.values(UserRoles).includes(role)) {
            throw new Error('Invalid role');
        }

        const user = await this.userRepo.setRole(userId, role);
        if (!user) {
            throw new Error('User not found');
        }

        await this.auditService.logAction(currentUserId, currentUserRole, 'set_user_role', 'user', userId, { role });
        return user;
    }
}

module.exports = SetUserRole;