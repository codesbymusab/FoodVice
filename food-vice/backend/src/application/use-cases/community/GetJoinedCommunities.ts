import ICommunityRepository from "../../interfaces/repositories/CommunityRepository";

export default class GetJoinedCommunities {
  constructor(private readonly communityRepo: ICommunityRepository) {}

  async execute({ userId }: { userId: string }) {
    return await this.communityRepo.findJoinedByUser(userId);
  }
}
