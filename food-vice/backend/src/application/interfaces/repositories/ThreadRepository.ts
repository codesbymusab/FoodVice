export default interface IThreadRepository {
  create(threadData: unknown): Promise<unknown>;

  findByCommunity(communityId: string, searchQuery?: string, topicIds?: string[]): Promise<unknown>;

  findById(id: string): Promise<unknown>;

  toggleLike(threadId: string, userId: string): Promise<unknown>;

  toggleDislike(threadId: string, userId: string): Promise<unknown>;

  addComment(commentData: unknown): Promise<unknown>;

  toggleCommentLike(commentId: string, userId: string): Promise<unknown>;

  getComments(threadId: string): Promise<unknown>;

  findAll(searchQuery?: string, topicIds?: string[]): Promise<unknown>;

  getPending(limit?: number, filters?: unknown): Promise<unknown>;

  flagThread(threadId: string, userId: string, reason: string): Promise<unknown>;

  moderateThread(threadId: string, moderatorId: string, action: string, note: string): Promise<unknown>;
}
