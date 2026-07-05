import { SimilarRestQueryParams } from "../../dtos/input/Restaurant/RestaurantQueryParams";
import IMediaRepository from "../../interfaces/repositories/MediaRepository";
import IRestaurantRepository from "../../interfaces/repositories/RestaurantRepository";

export default class GetSimilarRestaurants {
    constructor(private readonly restaurantRepo: IRestaurantRepository, private readonly mediaRepo: IMediaRepository) {

    }

    async execute(restId: string, query: SimilarRestQueryParams) {



        let result = {
            similarRestaurants: <any>[]
        }

        const queryLocation = [query.lat, query.lon]

        const search = await this.restaurantRepo.getSimilarRestaurants(restId)

        if ((search as any)[0]) {

            const restaurants = (search as any)[0]

            for (let i = 0; i < restaurants.topSimilarRestaurants.length; i++) {

                const location = await this.restaurantRepo.getLocation(restaurants.topSimilarRestaurants[i].restaurant.locationId, queryLocation)
                const media = await this.mediaRepo.getByOwnerId({ ownerId: restaurants.topSimilarRestaurants[i].restaurant._id, limitCount: 5 })

                if (media) {
                    restaurants.topSimilarRestaurants[i]['media'] = media
                }
                if ((location as any)[0]) {
                    result.similarRestaurants.push({ ...restaurants.topSimilarRestaurants[i], distKm: (location as any)[0].distKm })
                }
                else {

                    result.similarRestaurants.push(restaurants.topSimilarRestaurants[i])
                }

            }
        }
        return result

    }
}


