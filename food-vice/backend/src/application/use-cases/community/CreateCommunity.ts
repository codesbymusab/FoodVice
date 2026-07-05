import { CommunityDTO } from "../../dtos/input/Community/CommunityDTO";
import ICommunityRepository from "../../interfaces/repositories/CommunityRepository";
import IStorageService from "../../interfaces/services/StorageService";

export default class CreateCommunity {
  constructor(
    private readonly communityRepo: ICommunityRepository,
    private readonly storageService: IStorageService,
  ) {}

  async execute( userId: string , dto: CommunityDTO) {
    let coverPhoto = null;

    
    coverPhoto = await this.storageService.uploadFile(dto.file, "communities/covers");
    

    const community = await this.communityRepo.create({
      name:dto.name,
      description:dto.description,
      guidelines:dto.guidelines,
      coverPhoto,
      createdBy: userId,
    });

    await this.communityRepo.addMember({
      userId,
      communityId: (community as any)._id,
      role: "admin",
    });

    return community;
  }
}
