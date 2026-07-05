import { AdminSetUserRoleDTO } from "../../dtos/input/Admin/AdminRestaurantsQueryParams";
import IRestaurantRepository from "../../interfaces/repositories/RestaurantRepository";
import IAuditService from "../../interfaces/services/AuditService";

export default class CreateRestaurant {
  constructor(
    private readonly restaurantRepo: IRestaurantRepository,
    private readonly auditService: IAuditService,
  ) {}

  async execute({ payload, userId, userRole }: { payload: Record<string, unknown>; userId: string; userRole: string }) {
    if (!payload.name) {
      throw new Error("Restaurant name is required");
    }

    const restaurant = await this.restaurantRepo.createRestaurant(payload);
    await this.auditService.logAction(userId, userRole, "create_restaurant", "restaurant", (restaurant as any)._id, payload);
    return restaurant;
  }
}
