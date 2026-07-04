const { cursorPaginateRest } = require("../../../shared/utils/cursorPagination");
const { isRestaurantOpen } = require("../../../shared/utils/isRestaurantOpen");
const { openingTime } = require("../../../shared/utils/openingTime");

class GetRecommendedRestaurants {


    constructor(restaurantRepo, mediaRepo) {

        this.restaurantRepo = restaurantRepo;
        this.mediaRepo = mediaRepo
    }

    async execute(data) {

        if (!data.location) {
            throw new Error('Location is required')
        }

        if(!data.userId){
            throw new  Error('UserId is required')
        }

        let limit=data.limit

        if(limit && limit>100){
            limit=100
        }

        const result = await this.restaurantRepo.getRecommended(data.location,data.filters,data.userId,data.cursor, limit)

        if (result) {



            for (let i = 0; i < result.length; i++) {


                const media = await this.mediaRepo.getByOwnerId({ownerId:result[i]._id})
               
                if (media) {
                    result[i].media = media
                }
                const isOpen = isRestaurantOpen(result[i].openingHours)

                result[i].isOpen = isOpen

                const time = openingTime(result[i].openingHours)
                if (time) {
                    result[i].openingTime = time
                }
            }
        }
        return cursorPaginateRest(result,limit)

    }


}

module.exports = GetRecommendedRestaurants