import ICommentRepository from "../../interfaces/repositories/CommentRepository";

export default class GetReelComments {
  constructor(private readonly commentRepo: ICommentRepository) {}

  async execute({ reelId, userId, limit = 20 }: { reelId: string; userId: string; limit?: number }) {
    return await this.commentRepo.findByReelWithLikes(reelId, userId, limit);
  }
}
