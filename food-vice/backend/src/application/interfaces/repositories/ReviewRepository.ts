export default interface IReviewRepository {
  getCountByUserId(userId: string): Promise<unknown>;

  getCountByRestId(restId: string): Promise<unknown>;

  getRestaurantRating(restId: string): Promise<unknown>;

  getReviews(params: { restId?: string; userId?: string; cursor?: unknown; limit?: number; currentUser?: boolean }): Promise<unknown>;

  getRecentReviews(params: { userId?: string; cursor?: unknown; limit?: number; currentUser?: boolean }): Promise<unknown>;

  createReview(params: { userId: string; restaurantId: string; text: string }): Promise<unknown>;

  createRating(params: { reviewId: string; food: number; service: number; ambience: number; price: number; overall: number }): Promise<unknown>;

  getPending(limit?: number, filters?: unknown): Promise<unknown>;

  flagReview(reviewId: string, userId: string, reason: string): Promise<unknown>;

  moderateReview(reviewId: string, moderatorId: string, action: string, note: string): Promise<unknown>;
}
