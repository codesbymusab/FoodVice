import ICommunityRepository from "../../interfaces/repositories/CommunityRepository";

export default class GetRecommendedCommunities {
  constructor(private readonly communityRepo: ICommunityRepository) {}

  async execute({ userId }: { userId: string }) {
   
    return await this.communityRepo.findRecommendedCommunities(userId);
  }
}
