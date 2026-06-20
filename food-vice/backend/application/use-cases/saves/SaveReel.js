class SaveReel
{
    constructor(saveRepo) {
        this.saveRepo = saveRepo;
    }

    async execute(data) {
        
        if(!data.userId){
            throw new Error('User id required')
        }

        if(!data.reelId){
            throw new Error('Reel id required')
        }

        const save=await this.saveRepo.getByReelId({reelId:data.reelId,userId:data.userId})

        
        if(save){
            
            await this.saveRepo.unsaveReel(save._id)
            return 'Reel unsaved'
        }

        await this.saveRepo.saveReel({userId:data.userId,reelId:data.reelId})
        return 'Reel saved'
    }


}

module.exports = SaveReel