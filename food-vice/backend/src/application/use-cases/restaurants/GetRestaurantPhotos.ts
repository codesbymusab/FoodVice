import IMediaRepository from "../../interfaces/repositories/MediaRepository"

export default class GetRestaurantPhotos {
    constructor(private readonly mediaRepo: IMediaRepository) {

    }

    async execute({ restId }: { restId: string }) {

        if (restId) {
            throw new Error('Restaurant id required')
        }

        return this.mediaRepo.getByOwnerId({ ownerId: restId, limitCount: 5 })
    }

}


