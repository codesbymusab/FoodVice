import { CommentDTO } from "../../dtos/input/Comment/CommentDTO";
import ICommentRepository from "../../interfaces/repositories/CommentRepository";

export default class PostReelComment {
    constructor(private readonly commentRepo: ICommentRepository) { }

    async execute(reelId: string, userId: string, dto: CommentDTO) {

        return await this.commentRepo.createComment(reelId, userId, dto.text);
    }
}
