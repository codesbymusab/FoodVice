class GetReel{
  
    constructor(reelRepo) {
    this.reelRepo = reelRepo; 
  }

  async execute({ reelId,userId,}) {

    if(!userId) throw new Error('UserId required')
    if(!reelId) throw new Error('ReelId required')
    const reel = await this.reelRepo.getById(reelId,userId);
    return reel;
  }
}

module.exports = GetReel
