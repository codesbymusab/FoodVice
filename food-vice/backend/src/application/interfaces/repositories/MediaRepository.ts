import { UploadReelDTO } from "../../dtos/input/Reel/UploadReelDTO";

export default interface IMediaRepository {

  save({ url, type, ownerType, ownerId, uploadedBy }: { url: string, type: 'video' | 'image', ownerType: string, ownerId: string, uploadedBy: string }): Promise<unknown>;

  getByOwnerId({ ownerId, limitCount }: { ownerId: string, limitCount: number }): Promise<unknown>;

}

