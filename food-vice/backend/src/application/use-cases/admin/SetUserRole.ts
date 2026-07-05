import { AdminSetUserRoleDTO } from "../../dtos/input/Admin/AdminRestaurantsQueryParams";
import { IUserRepository } from "../../interfaces/repositories/UserRepository";
import IAuditService from "../../interfaces/services/AuditService";

const { UserRoles } = require("../../../shared/utils/moderationConstants");

export default class SetUserRole {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly auditService: IAuditService,
  ) {}

  async execute({ userId, role, currentUserId, currentUserRole }: AdminSetUserRoleDTO & { userId: string; currentUserId: string; currentUserRole: string }) {
    if (!role || !Object.values(UserRoles).includes(role)) {
      throw new Error("Invalid role");
    }

    const user = await this.userRepo.setRole(userId, role);
    if (!user) {
      throw new Error("User not found");
    }

    await this.auditService.logAction(currentUserId, currentUserRole, "set_user_role", "user", userId, { role });
    return user;
  }
}
