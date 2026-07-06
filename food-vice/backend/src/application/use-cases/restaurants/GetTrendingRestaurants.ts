import { RestListQueryParams } from "../../dtos/input/Restaurant/RestaurantQueryParams";
import IMediaRepository from "../../interfaces/repositories/MediaRepository";
import IRestaurantRepository from "../../interfaces/repositories/RestaurantRepository";


export default class GetTrendingRestaurants {

    constructor(private readonly restaurantRepo: IRestaurantRepository, private readonly mediaRepo: IMediaRepository) {


    }


    async execute(userId: string, query: RestListQueryParams) {

        const location = [query.lon,query.lat]

        const { cursor, limit } = query

        const results = await this.restaurantRepo.getTrending({ userId, limit, location, maxDistance: query.dist });

        if (results) {
            for (let i = 0; i < (results as any).length; i++) {

                try {
                    const media = await this.mediaRepo.getByOwnerId({ ownerId: (results as any)[i]._id, limitCount: 5 })

                    if (media) {
                        (results as any)[i]['media'] = media
                    }
                } catch (err) {

                }
            }
        }


        return results;
    }
}
