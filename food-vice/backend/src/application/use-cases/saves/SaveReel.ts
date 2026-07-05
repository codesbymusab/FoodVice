import ISaveRepository from "../../interfaces/repositories/SaveRepository";

export default class SaveReel
{
    constructor(private readonly saveRepo:ISaveRepository) {
        
    }

    async execute({reelId,userId}:{reelId:string,userId:string}) {
        
     
        const save=await this.saveRepo.getByReelId({reelId,userId})

        
        if(save){
            
            await this.saveRepo.unsaveReel((save as any)._id)
            return 'Reel unsaved'
        }

        await this.saveRepo.saveReel({userId,reelId})
        return 'Reel saved'
    }


}

