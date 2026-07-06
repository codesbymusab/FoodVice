import { RestListQueryParams } from "../../dtos/input/Restaurant/RestaurantQueryParams";
import IMediaRepository from "../../interfaces/repositories/MediaRepository";
import IRestaurantRepository from "../../interfaces/repositories/RestaurantRepository";

const { cursorPaginateRest } = require("../../../shared/utils/cursorPagination");
const { isRestaurantOpen } = require("../../../shared/utils/isRestaurantOpen");
const { openingTime } = require("../../../shared/utils/openingTime");

export default class GetTopRatedyRestaurants {


    constructor(private readonly restaurantRepo: IRestaurantRepository, private readonly mediaRepo: IMediaRepository) {


    }

    async execute(userId: string, query: RestListQueryParams) {

        const filters = {
            cuisine: query.cuisine,
            price: query.price,
            rating: query.rating,
            dist: query.dist
        }
        const location = [query.lon,query.lat]

        const { cursor, limit } = query

        let limitCap = limit
        if (limit && limit > 100) {
            limitCap = 100
        }


        const result = await this.restaurantRepo.getTopRated(location, filters, userId, cursor, limitCap)

        if (result) {



            for (let i = 0; i < (result as any).length; i++) {


                const media = await this.mediaRepo.getByOwnerId({ ownerId: (result as any)[i]._id, limitCount: 5 })

                if (media) {
                    (result as any)[i].media = media
                }
                const isOpen = isRestaurantOpen((result as any)[i].openingHours) as boolean

                (result as any)[i].isOpen = isOpen

                const time = openingTime((result as any)[i].openingHours)
                if (time) {
                    (result as any)[i].openingTime = time
                }
            }
        }

        return cursorPaginateRest(result, limitCap)


    }


}

