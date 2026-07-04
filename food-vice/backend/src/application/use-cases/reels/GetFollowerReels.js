const { cursorPaginateReels } = require("../../../shared/utils/cursorPagination");

class GetFollowerReels {

  constructor(reelRepo) {
    this.reelRepo = reelRepo;
  }


  async execute({ userId, cursor, limit, tag }) {


    if (!userId) throw new Error('UserId required')

    let limitCap = limit

    if (limit && limit > 100) {
      limitCap = 100
    }
    const reels = await this.reelRepo.getReels(userId, cursor, limitCap,'followers', tag);
    return cursorPaginateReels(reels, limitCap)
  }
}

module.exports = GetFollowerReels
