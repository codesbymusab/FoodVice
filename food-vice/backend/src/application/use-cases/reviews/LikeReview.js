class LikeReview
{
    constructor(likeRepo) {
        this.likeRepo = likeRepo;
    }

    async execute(data) {
        
        if(!data.userId){
            throw new Error('User id required')
        }

        if(!data.reviewId){
            throw new Error('Review id required')
        }
 
        const like=await this.likeRepo.getByReviewId({reviewId:data.reviewId,userId:data.userId})

        
        if(like){
            
            await this.likeRepo.unlikeReview(like._id)
            return 'Review unliked'
        }

        await this.likeRepo.likeReview({userId:data.userId,reviewId:data.reviewId})
        return 'Review liked'
    }


}

module.exports = LikeReview