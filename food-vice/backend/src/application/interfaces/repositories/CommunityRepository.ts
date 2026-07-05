export default interface ICommunityRepository {
  create(communityData: unknown): Promise<unknown>;

  addMember(memberData: unknown): Promise<unknown>;

  findByName(name: string): Promise<unknown>;

  findRecommendedCommunities(userId: string): Promise<unknown>;

  findById(id: string): Promise<unknown>;

  findJoinedByUser(userId: string): Promise<unknown>;

  isMember(userId: string, communityId: string): Promise<unknown>;
}
