import ISaveRepository from "../../interfaces/repositories/SaveRepository";

export default class SaveRestaurant
{
    constructor(private readonly saveRepo:ISaveRepository) {
        
    }

    async execute({userId,restId}:{userId:string,restId:string}) {
        
        
        const save=await this.saveRepo.getByRestId({restId,userId})

        
        if(save){
         
            await this.saveRepo.unsaveRestaurant((save as any)._id)
            return 'Restaurant unsaved'
        }

        await this.saveRepo.saveRestaurant({userId,restId})
        return 'Restaurant saved'
    }


}

