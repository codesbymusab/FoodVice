import ILikeRepository from "../../interfaces/repositories/LikeRepository";

export default class LikeReview
{
    constructor(private readonly likeRepo:ILikeRepository) {
        
    }

    async execute({userId,reviewId}:{userId:string,reviewId:string}) {
        
       
 
        const like=await this.likeRepo.getByReviewId({reviewId,userId})

        
        if(like){
            
            await this.likeRepo.unlikeReview((like as any)._id)
            return 'Review unliked'
        }

        await this.likeRepo.likeReview({userId,reviewId})
        return 'Review liked'
    }


}

