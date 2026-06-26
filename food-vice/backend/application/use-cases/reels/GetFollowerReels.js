const { cursorPaginateReels, decodeCursor } = require("../../../shared/utils/cursorPagination");

class GetFollowerReels {

  constructor(reelRepo) {
    this.reelRepo = reelRepo;
  }


  async execute({ userId, cursor, limit, tag = null }) {


    if (!userId) throw new Error('UserId required')

    let limitCap = limit

    if (limit && limit > 100) {
      limitCap = 100
    }
    const reels = await this.reelRepo.getReels(userId, cursor ? decodeCursor(cursor) : undefined, limitCap,'followers', tag);
    return cursorPaginateReels(reels, limitCap)
  }
}

module.exports = GetFollowerReels
