import { UploadReelDTO } from "../../dtos/input/Reel/uploadReelDTO";

export default interface IMediaRepository {

  save(mediaData:UploadReelDTO):Promise<unknown>;

  getByOwnerId({ ownerId, limitCount}:{ownerId:string,limitCount:number}):Promise<unknown>;

  getById(id:string):Promise<unknown>;
}

