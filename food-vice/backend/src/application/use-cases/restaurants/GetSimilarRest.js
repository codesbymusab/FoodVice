class GetSimilarRestaurants {
    constructor(restaurantRepo,mediaRepo) {

        this.restaurantRepo = restaurantRepo;
        this.mediaRepo=mediaRepo
    }

    async execute(data) {

        if (!data.id) {
            throw new Error('Restaurant id required')
        }

        let result = {
            similarRestaurants: []
        }

        if (data.location) {
            const search = await this.restaurantRepo.getSimilarRestaurants(data.id)

            if (search[0]) {

                const restaurants = search[0]

                for (let i = 0; i < restaurants.topSimilarRestaurants.length; i++) {

                    const location = await this.restaurantRepo.getLocation(restaurants.topSimilarRestaurants[i].restaurant.locationId, data.location)
                    const media=await this.mediaRepo.getByOwnerId({ownerId:restaurants.topSimilarRestaurants[i].restaurant._id})
        
                    if(media){
                        restaurants.topSimilarRestaurants[i]['media']=media
                    }
                    if (location[0]) {
                        result.similarRestaurants.push({ ...restaurants.topSimilarRestaurants[i], distKm: location[0].distKm })
                    }
                    else {

                        result.similarRestaurants.push(restaurants.topSimilarRestaurants[i])
                    }

                }
            }
            return result
        }
    }
}


module.exports = GetSimilarRestaurants