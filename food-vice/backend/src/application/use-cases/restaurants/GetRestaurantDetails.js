const { isRestaurantOpen } = require("../../../shared/utils/isRestaurantOpen");
const { openingTime } = require("../../../shared/utils/openingTime");
const {formatReviewDate}=require('../../../shared/utils/dateFormatter')


class GetRestaurantDetails {
    constructor(restaurantRepo, mediaRepo, reviewRepo,saveRepo) {
        this.restaurantRepo = restaurantRepo;
        this.mediaRepo = mediaRepo
        this.reviewRepo = reviewRepo
        this.saveRepo=saveRepo
    }

    async execute(data) {
        if (!data.id) {
            throw new Error("Restaurant id required");
        }

        const result = {};
        const restaurant = await this.restaurantRepo.getById(data.id);
        if (!restaurant) {
            throw new Error("Restaurant not found");
        }

        const currentLocation = data.location;
        const userId=data.userId
        result.restaurant = restaurant;

        switch (restaurant.priceCategory) {
            case "$$$":
                restaurant.priceCategory += " • High-end Dining";
                break;
            case "$$":
                restaurant.priceCategory += " • Budget Oriented";
                break;
            case "$":
                restaurant.priceCategory += " • Economical";
                break;
        }

        const [
            cuisines,
            location,
            media,
            openingHours,
            labels,
            rating,
            recentReviews,
            userReview,
            saveStatus

        ] = await Promise.all([
            this.restaurantRepo.getCuisines(restaurant._id),
            this.restaurantRepo.getLocation(restaurant.locationId, currentLocation),
            this.mediaRepo.getByOwnerId({ownerId:restaurant._id,limitCount:1}),
            this.restaurantRepo.getOpeningHours(restaurant._id),
            this.restaurantRepo.getLabels(restaurant._id),
            this.reviewRepo.getRestaurantRating(restaurant._id),
            this.reviewRepo.getReviews({restId:restaurant._id,userId:userId}),
            this.reviewRepo.getReviews({restId:restaurant._id,userId:userId,limit:1,currentUser:true}),
            this.saveRepo.getByRestId({restId:restaurant._id,userId:data.userId})
        
        ]);

        
        if (cuisines) result.cuisines = cuisines;
        if (location[0]) result.location = location[0];
        if (media) result.media = media;
        if (openingHours) result.openingHours = openingHours;
        if (labels) result.labels = labels;
        if (rating[0]) {
            result.rating = rating[0];
            result.reviewCount = rating[0].totalReviews;
        }
   
        
        if (recentReviews) {
            
            const withCounts = await Promise.all(
                recentReviews.map(async (review) => {
                    const userReviewCount = await this.reviewRepo.getCountByUserId(review.user._id);
                    return {
                        ...review,
                        createdAt: formatReviewDate(review.createdAt),
                        user: {
                            ...review.user,
                            reviewCount: userReviewCount[0]?.reviewCount || 0
                        }
                    };
                })
            );
            result.recentReviews = withCounts;
        }

       if(userReview[0]){
            userReview[0].createdAt=formatReviewDate(userReview[0].createdAt),
            result.userReview=userReview[0]
       }
        result.isOpen = isRestaurantOpen(result.openingHours);
        const time = openingTime(result.openingHours);
        if (time) result.openingTime = time;

    

        if (saveStatus) {
            result.isSaved=true
        }
        else{
            result.isSaved=false
        }

        return result;
    }



}

module.exports = GetRestaurantDetails