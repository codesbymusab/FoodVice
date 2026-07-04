class GetRestaurantPhotos {
    constructor(mediaRepo) {
        this.mediaRepo=mediaRepo
    }

    async execute(data) {

        if (!data.restId) {
            throw new Error('Restaurant id required')
        }

        return this.mediaRepo.getByOwnerId({ownerId:data.restId,limitCount:5})
    }
    
}


module.exports = GetRestaurantPhotos