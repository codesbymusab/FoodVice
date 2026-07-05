export default interface IRestaurantRepository {
  getRecommended(location: unknown, filters: unknown, userId: string, cursor: unknown, limit?: number): Promise<unknown>;

  getTopRated(location: unknown, filters: unknown, userId: string, cursor: unknown, limit?: number): Promise<unknown>;

  getNearby(location: unknown, filters: unknown, userId: string, limitCount?: number): Promise<unknown>;

  getById(id: string): Promise<unknown>;

  getLocation(locationId: string, from: unknown): Promise<unknown>;

  getOpeningHours(id: string): Promise<unknown>;

  getCuisines(restId?: string): Promise<unknown>;

  getLabels(id: string): Promise<unknown>;

  getSimilarRestaurants(id: string): Promise<unknown>;

  getSavedRestaurants(userId: string, limit?: number): Promise<unknown>;

  getTrending(params?: { userId?: string | null; limit?: number; location?: unknown; maxDistance?: number }): Promise<unknown>;

  getAll(filters?: unknown, page?: number, limit?: number): Promise<unknown>;

  createRestaurant(payload: unknown): Promise<unknown>;

  updateRestaurant(id: string, payload: unknown): Promise<unknown>;

  deleteRestaurant(id: string): Promise<unknown>;
}
