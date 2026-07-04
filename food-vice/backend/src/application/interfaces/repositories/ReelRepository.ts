import { ReelQueryParams } from "../../dtos/input/Reel/ReelQueryParams";
import { UploadReelDTO } from "../../dtos/input/Reel/UploadReelDTO";

export default interface IReelRepository {
  getReels(
    userId: string,
    query:ReelQueryParams,
    source:string
  ): Promise<unknown>;

  findRecent(limit: any, userId: string): Promise<unknown>;

  createReel(dto:UploadReelDTO): Promise<unknown>;

  getPopularTags(limit?: any): Promise<unknown>;

  getById(reelId: string, userId: string): Promise<unknown>;

  suggestAccounts(userId: string, limit?: any): Promise<unknown>;
}
