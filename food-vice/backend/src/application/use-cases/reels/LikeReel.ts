import ILikeRepository from "../../interfaces/repositories/LikeRepository";

export default class LikeReel {
    constructor(private readonly likeRepo: ILikeRepository) { }

    async execute({ userId, reelId }: { userId: string, reelId: string }) {


        const like = await this.likeRepo.getByReelId({ reelId, userId });

        if (like) {
            await this.likeRepo.unlikeReel((like as any)._id);
            return "Reel unliked";
        }

        await this.likeRepo.likeReel({ userId, reelId });
        return "Reel liked";
    }
}
