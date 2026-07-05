import IReelRepository from "../../interfaces/repositories/ReelRepository";

export default class SuggestAccounts {
  constructor(private readonly reelRepo: IReelRepository) {}

  async execute(userId: string, limit = 5) {
 
    return await this.reelRepo.suggestAccounts(userId, limit);
  }
}
