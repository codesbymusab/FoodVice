import IRestaurantRepository from "../../interfaces/repositories/RestaurantRepository";
import IAuditService from "../../interfaces/services/AuditService";

export default class DeleteRestaurant {
  constructor(
    private readonly restaurantRepo: IRestaurantRepository,
    private readonly auditService: IAuditService,
  ) {}

  async execute({ restaurantId, userId, userRole }: { restaurantId: string; userId: string; userRole: string }) {
    const deleted = await this.restaurantRepo.deleteRestaurant(restaurantId);
    if (!deleted) {
      throw new Error("Restaurant not found");
    }

    await this.auditService.logAction(userId, userRole, "delete_restaurant", "restaurant", restaurantId, {});
    return deleted;
  }
}
