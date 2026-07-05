import { CommunityQueryParams } from "../../dtos/input/Community/CommunityQueryParams";
import ICommunityRepository from "../../interfaces/repositories/CommunityRepository";

export default class GetCommunities {
  constructor(private readonly communityRepo: ICommunityRepository) {}

  async execute({ name }: CommunityQueryParams) {
    return await this.communityRepo.findByName(name ?? "");
  }
}
