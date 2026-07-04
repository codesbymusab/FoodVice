const { cursorPaginateReels } = require("../../../shared/utils/cursorPagination");

class GetRecentReels {

  constructor(reelRepo) {
    this.reelRepo = reelRepo;
  }

  async execute({ cursor, limit, userId, tag }) {

    if (!userId) throw new Error('UserId required')

    let limitCap = limit

    if (limit && limit > 100) {
      limitCap = 100
    }
    const reels = await this.reelRepo.getReels(userId, cursor , limitCap, "all", tag);
    return cursorPaginateReels(reels, limitCap)
  }
}

module.exports = GetRecentReels
