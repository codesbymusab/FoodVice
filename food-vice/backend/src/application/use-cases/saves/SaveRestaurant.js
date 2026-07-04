class SaveRestaurant
{
    constructor(saveRepo) {
        this.saveRepo = saveRepo;
    }

    async execute(data) {
        
        if(!data.userId){
            throw new Error('User id required')
        }

        if(!data.restId){
            throw new Error('Restaurant id required')
        }

        const save=await this.saveRepo.getByRestId({restId:data.restId,userId:data.userId})

        
        if(save){
         
            await this.saveRepo.unsaveRestaurant(save._id)
            return 'Restaurant unsaved'
        }

        await this.saveRepo.saveRestaurant({userId:data.userId,restId:data.restId})
        return 'Restaurant saved'
    }


}

module.exports = SaveRestaurant