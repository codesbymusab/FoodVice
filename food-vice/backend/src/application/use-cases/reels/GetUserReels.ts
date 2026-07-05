import { UserReelsQueryParams } from "../../dtos/input/Reel/ReelQueryParams";
import IReelRepository from "../../interfaces/repositories/ReelRepository";

const { cursorPaginateReels } = require("../../../shared/utils/cursorPagination");

export default class GetUserReels {
    
    constructor(private readonly reelRepo: IReelRepository) { }

    async execute(userId: string, query: UserReelsQueryParams) {

        const { savedCursor, userCursor, limit } = query

        let limitCap = limit;

        if (limit && limit > 100) {
            limitCap = 100;
        }

        const savedReels = await this.reelRepo.getReels(userId, savedCursor, limitCap, "saved");
        const userReels = await this.reelRepo.getReels(userId, userCursor, limitCap, "user");

        return {
            saved: cursorPaginateReels(savedReels, limitCap),
            user: cursorPaginateReels(userReels, limitCap),
        };
    }
}
