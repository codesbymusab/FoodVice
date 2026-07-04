// application/use-cases/GetTrendingRestaurants.js
class GetTrendingRestaurants {

    constructor(restaurantRepo, mediaRepo) {
        this.restaurantRepo = restaurantRepo;
        this.mediaRepo = mediaRepo;
    }

    async execute(params = {}) {
        const { userId = null, limit = 5, location = null, maxDistance = null } = params;
        const results = await this.restaurantRepo.getTrending({ userId, limit, location, maxDistance });

        if (results) {
            for (let i = 0; i < results.length; i++) {
         
                try {
                    const media = await this.mediaRepo.getByOwnerId({ ownerId: results[i]._id })
                
                    if (media) {
                        results[i]['media'] = media
                    }
                } catch (err) {

                }
            }
        }


        return results;
    }
}

module.exports = GetTrendingRestaurants;
