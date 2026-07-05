export default interface ILikeRepository {
  likeReview(params: { userId: string; reviewId: string }): Promise<unknown>;

  unlikeReview(id: string): Promise<unknown>;

  getByReviewId(params: { reviewId: string; userId: string }): Promise<unknown>;

  likeReel(params: { userId: string; reelId: string }): Promise<unknown>;

  unlikeReel(id: string): Promise<unknown>;

  getByReelId(params: { reelId: string; userId: string }): Promise<unknown>;

  toggleReelCommentLike(commentId: string, userId: string): Promise<unknown>;
}
