const { cursorPaginateReels, decodeCursor } = require("../../../shared/utils/cursor");

class GetRecentReels {

  constructor(reelRepo) {
    this.reelRepo = reelRepo;
  }

  async execute({ cursor, limit, userId, tag = null }) {

    if (!userId) return new Error('UserId required')
    let limitCap = limit

    if (limit && limit > 100) {
      limitCap = 100
    }
    const reels = await this.reelRepo.getReels(userId, cursor ? decodeCursor(cursor) : undefined, limitCap, "all", tag);
    return cursorPaginateReels(reels, limitCap)
  }
}

module.exports = GetRecentReels
