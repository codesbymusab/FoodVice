import ILikeRepository from "../../interfaces/repositories/LikeRepository";

export default class LikeReelComment {
  constructor(private readonly likeRepo: ILikeRepository) {}

  async execute({ commentId, userId }: { commentId: string; userId: string }) {
    

    return await this.likeRepo.toggleReelCommentLike(commentId, userId);
  }
}
