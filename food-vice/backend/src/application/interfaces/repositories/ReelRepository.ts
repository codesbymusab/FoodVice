import { ReelQueryParams } from "../../dtos/input/Reel/ReelQueryParams";
import { UploadReelDTO } from "../../dtos/input/Reel/UploadReelDTO";

export default interface IReelRepository {
  getReels(
    userId: string,
    cursor?: {
      createdAt: number;
    },
    limit?: number,
    source?: string,
    tag?: string,
  ): Promise<unknown>;

  findRecent(limit: any, userId: string): Promise<unknown>;

  createReel({title, description, tags, userId}:{title:string, description:string, tags?:string[], userId:string}): Promise<unknown>;

  getPopularTags(limit?: any): Promise<unknown>;

  getById(reelId: string, userId: string): Promise<unknown>;

  suggestAccounts(userId: string, limit?: any): Promise<unknown>;
}
