import { ReelQueryParams} from "../../dtos/input/Reel/ReelQueryParams";
import IReelRepository from "../../interfaces/repositories/ReelRepository";

const { cursorPaginateReels } = require("../../../shared/utils/cursorPagination");

export default class GetFollowerReels {
  constructor(private readonly reelRepo: IReelRepository) {}

  async execute(userId:string,query:ReelQueryParams) {
  
    const { cursor, limit, tag } = query

    let limitCap = limit;

    if (limit && limit > 100) {
      limitCap = 100;
    }

    const reels = await this.reelRepo.getReels(userId, cursor, limitCap, "followers", tag);
    return cursorPaginateReels(reels, limitCap);
  }
}
