const { cursorPaginateReels, decodeCursor } = require("../../../shared/utils/cursor");

class GetUserReels {

  constructor(reelRepo) {
    this.reelRepo = reelRepo;
  }

  async execute({ cursor, limit, userId }) {

    if (!userId) return new Error('UserId required')

    let limitCap = limit

    if (limit && limit > 100) {
      limitCap = 100
    }
    const savedReels = await this.reelRepo.getReels(userId, cursor ? decodeCursor(cursor) : undefined, limitCap, 'saved');
    const userReels = await this.reelRepo.getReels(userId, cursor ? decodeCursor(cursor) : undefined, limitCap, 'user');

    return cursorPaginateReels({
      saved: savedReels,
      user: userReels
    },
      limitCap)
  }
}

module.exports = GetUserReels
