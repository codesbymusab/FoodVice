import { PopularTagsParams, popularTagsQuerySchema } from "../../dtos/input/Reel/ReelQueryParams";
import IReelRepository from "../../interfaces/repositories/ReelRepository";

export default class GetPopularTags {
  constructor(private readonly reelRepo: IReelRepository) {}

  async execute(query: PopularTagsParams) {
    return await this.reelRepo.getPopularTags(query.limit);
    
  }
}
