export default interface ICommentRepository {
  findByReelWithLikes(reelId: string, userId: string, limit?: number): Promise<unknown>;

  createComment(reelId: string, userId: string, text: string): Promise<unknown>;
}
