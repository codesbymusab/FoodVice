import ICommunityRepository from "../../interfaces/repositories/CommunityRepository";

export default class JoinCommunity {
  constructor(private readonly communityRepo: ICommunityRepository) {}

  async execute({ userId, communityId }: { userId: string; communityId: string }) {
    const alreadyMember = await this.communityRepo.isMember(userId, communityId);
    if (alreadyMember) {
      throw new Error("Already a member of this community");
    }

    return await this.communityRepo.addMember({
      userId,
      communityId,
      role: "member",
    });
  }
}
