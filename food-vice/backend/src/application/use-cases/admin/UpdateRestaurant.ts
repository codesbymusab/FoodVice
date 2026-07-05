import IRestaurantRepository from "../../interfaces/repositories/RestaurantRepository";
import IAuditService from "../../interfaces/services/AuditService";

export default class UpdateRestaurant {
  constructor(
    private readonly restaurantRepo: IRestaurantRepository,
    private readonly auditService: IAuditService,
  ) {}

  async execute({ restaurantId, payload, userId, userRole }: { restaurantId: string; payload: Record<string, unknown>; userId: string; userRole: string }) {
    const restaurant = await this.restaurantRepo.updateRestaurant(restaurantId, payload);
    if (!restaurant) {
      throw new Error("Restaurant not found");
    }

    await this.auditService.logAction(userId, userRole, "update_restaurant", "restaurant", restaurantId, payload);
    return restaurant;
  }
}
