class ModerateThread {
    constructor(threadRepo, auditService) {
        this.threadRepo = threadRepo;
        this.auditService = auditService;
    }

    async execute({ threadId, userId, userRole, action, note }) {
        const validActions = ['approve', 'reject', 'hide'];
        if (!validActions.includes(action)) {
            throw new Error('Invalid moderation action');
        }

        const thread = await this.threadRepo.moderateThread(threadId, userId, action, note);
        if (!thread) {
            throw new Error('Thread not found');
        }

        await this.auditService.logAction(userId, userRole, `${action}_thread`, 'thread', threadId, { note });
        return thread;
    }
}

module.exports = ModerateThread;