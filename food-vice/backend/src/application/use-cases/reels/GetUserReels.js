const { cursorPaginateReels } = require("../../../shared/utils/cursorPagination");

class GetUserReels {

  constructor(reelRepo) {
    this.reelRepo = reelRepo;
  }

  async execute({ savedCursor,userCursor, limit, userId }) {

    if (!userId) throw new Error('UserId required')

    let limitCap = limit

    if (limit && limit > 100) {
      limitCap = 100
    }
    const savedReels = await this.reelRepo.getReels(userId, savedCursor, limitCap, 'saved');
    const userReels = await this.reelRepo.getReels(userId, userCursor, limitCap, 'user');

    return { saved:cursorPaginateReels(savedReels,limitCap),user:cursorPaginateReels(userReels,limitCap)}
  }
}

module.exports = GetUserReels
