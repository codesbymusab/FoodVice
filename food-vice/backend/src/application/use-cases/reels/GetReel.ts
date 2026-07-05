import IReelRepository from "../../interfaces/repositories/ReelRepository";

export default class GetReel {
  constructor(private readonly reelRepo: IReelRepository) {}

  async execute({ reelId, userId }: { reelId: string; userId: string }) {
   
    return await this.reelRepo.getById(reelId, userId);
  }
}
