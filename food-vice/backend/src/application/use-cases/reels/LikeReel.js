class LikeReel
{
    constructor(likeRepo) {
        this.likeRepo = likeRepo;
    }

    async execute(data) {
        
        if(!data.userId){
            throw new Error('User id required')
        }

        if(!data.reelId){
            throw new Error('Reel id required')
        }
    
        const like=await this.likeRepo.getByReelId({reelId:data.reelId,userId:data.userId})

        
        if(like){
            
            await this.likeRepo.unlikeReel(like._id)
            return 'Reel unliked'
        }

        await this.likeRepo.likeReel({userId:data.userId,reelId:data.reelId})
        return 'Reel liked'
    }


}

module.exports = LikeReel