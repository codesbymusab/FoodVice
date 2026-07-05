import { ModerateThreadDTO } from "../../dtos/input/Moderation/ModerationDTO";
import IThreadRepository from "../../interfaces/repositories/ThreadRepository";
import IAuditService from "../../interfaces/services/AuditService";

export default class ModerateThread {
    constructor(
        private readonly threadRepo: IThreadRepository,
        private readonly auditService: IAuditService,
    ) { }

    async execute({ action, note }: ModerateThreadDTO, { threadId, userId, userRole }: { threadId: string; userId: string; userRole: string }) {
        const validActions = ["approve", "reject", "hide"];
        if (!validActions.includes(action)) {
            throw new Error("Invalid moderation action");
        }

        const thread = await this.threadRepo.moderateThread(threadId, userId, action, note ?? "");
        if (!thread) {
            throw new Error("Thread not found");
        }

        await this.auditService.logAction(userId, userRole, `${action}_thread`, "thread", threadId, { note });
        return thread;
    }
}
