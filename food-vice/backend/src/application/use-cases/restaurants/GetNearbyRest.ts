import { RestListQueryParams } from "../../dtos/input/Restaurant/RestaurantQueryParams";
import IMediaRepository from "../../interfaces/repositories/MediaRepository";
import IRestaurantRepository from "../../interfaces/repositories/RestaurantRepository";

const { isRestaurantOpen } = require("../../../shared/utils/isRestaurantOpen");
const { openingTime } = require("../../../shared/utils/openingTime");

export default class GetNearbyyRestaurants {


    constructor(private readonly restaurantRepo: IRestaurantRepository, private readonly mediaRepo: IMediaRepository) {


    }

    async execute(userId: string, query: RestListQueryParams) {

        const filters = {
            cuisine: query.cuisine,
            price: query.price,
            rating: query.rating,
            dist: query.dist
        }

        console.log(filters)


        const location=[query.lon,query.lat]

        const result = await this.restaurantRepo.getNearby(location, filters, userId,query.limit)

        if (result) {



            for (let i = 0; i < (result as any).length; i++) {


                const media = await this.mediaRepo.getByOwnerId({ ownerId: (result as any)[i]._id,limitCount:5 })

                if (media) {
                    (result as any)[i]['media'] = media
                }
                const isOpen = isRestaurantOpen((result as any)[i]['openingHours']) as boolean

                (result as any)[i]['isOpen'] = isOpen

                const time = openingTime((result as any)[i]['openingHours'])
                if (time) {
                    (result as any)[i]['openingTime'] = time
                }
            }
        }
        return result

    }


}

