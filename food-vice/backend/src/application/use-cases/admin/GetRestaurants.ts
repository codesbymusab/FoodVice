import { AdminRestaurantQueryParams } from "../../dtos/input/Admin/AdminRestaurantsQueryParams";
import IRestaurantRepository from "../../interfaces/repositories/RestaurantRepository";

export default class GetRestaurants {
  constructor(private readonly restaurantRepo: IRestaurantRepository) {}

  async execute({ filters = {}, page = 1, limit = 20 }: AdminRestaurantQueryParams & { filters?: Record<string, unknown> }) {
    return await this.restaurantRepo.getAll(filters, page, limit);
  }
}
