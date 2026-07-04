class SuggestAccounts{
  constructor( reelRepo) {
    this.reelRepo=reelRepo
  }


  async execute(userId, limit = 5) {
    if(!userId) throw new Error('UserId required')
    return await this.reelRepo.suggestAccounts(userId, limit);
  }
}

module.exports=SuggestAccounts
