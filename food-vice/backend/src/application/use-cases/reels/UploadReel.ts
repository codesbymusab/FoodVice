import { UploadReelDTO } from "../../dtos/input/Reel/UploadReelDTO";
import IMediaRepository from "../../interfaces/repositories/MediaRepository";
import IReelRepository from "../../interfaces/repositories/ReelRepository";
import IStorageService from "../../interfaces/services/StorageService";

export default class UploadReel {
  constructor(
    private readonly mediaRepo: IMediaRepository,
    private readonly reelRepo: IReelRepository,
    private readonly storageService: IStorageService,
  ) {}

  async execute(data: UploadReelDTO) {
    const { title, description, tags, userId, file } = data;

  
    const url = await this.storageService.uploadFile(file, "reels");

    const reel = await this.reelRepo.createReel({
      title,
      description,
      tags,
      userId,
     
    } );

    const media = await this.mediaRepo.save({
      url: url as string,
      type: "video",
      ownerType: "reel",
      ownerId: (reel as any)._id,
      uploadedBy: userId,
    });

    return media;
  }
}
