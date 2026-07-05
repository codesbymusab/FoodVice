import { RestDetailsQueryParams } from "../../dtos/input/Restaurant/RestaurantQueryParams";
import IMediaRepository from "../../interfaces/repositories/MediaRepository";
import IRestaurantRepository from "../../interfaces/repositories/RestaurantRepository";
import IReviewRepository from "../../interfaces/repositories/ReviewRepository";
import ISaveRepository from "../../interfaces/repositories/SaveRepository";

const { isRestaurantOpen } = require("../../../shared/utils/isRestaurantOpen");
const { openingTime } = require("../../../shared/utils/openingTime");
const {formatReviewDate}=require('../../../shared/utils/dateFormatter')


export default class GetRestaurantDetails {
    constructor(private readonly restaurantRepo:IRestaurantRepository,private readonly mediaRepo:IMediaRepository,private readonly reviewRepo:IReviewRepository,private readonly saveRepo:ISaveRepository) {
    }

    async execute(userId:string,restId:string,query:RestDetailsQueryParams) {
       

        const result = {};
        const restaurant = await this.restaurantRepo.getById(restId);
        if (!restaurant) {
            throw new Error("Restaurant not found");
        }

        const lat = query.lat;
        const lon=query.lon;
        
        (result as any).restaurant = restaurant;

        switch ((restaurant as any).priceCategory) {
            case "$$$":
                (restaurant as any).priceCategory += " • High-end Dining";
                break;
            case "$$":
                (restaurant as any).priceCategory += " • Budget Oriented";
                break;
            case "$":
                (restaurant as any).priceCategory += " • Economical";
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
            this.restaurantRepo.getCuisines((restaurant as any)._id),
            this.restaurantRepo.getLocation((restaurant as any).locationId, [lat,lon]),
            this.mediaRepo.getByOwnerId({ownerId:(restaurant as any)._id,limitCount:1}),
            this.restaurantRepo.getOpeningHours((restaurant as any)._id),
            this.restaurantRepo.getLabels((restaurant as any)._id),
            this.reviewRepo.getRestaurantRating((restaurant as any)._id),
            this.reviewRepo.getReviews({restId:(restaurant as any)._id,userId}),
            this.reviewRepo.getReviews({restId:(restaurant as any)._id,userId,limit:1,currentUser:true}),
            this.saveRepo.getByRestId({restId:(restaurant as any)._id,userId})
        
        ]);

        
        if (cuisines) (result as any).cuisines = cuisines;
        if ((location as any)[0]) (result as any).location = (location as any)[0];
        if (media) (result as any).media = media;
        if (openingHours) (result as any).openingHours = openingHours;
        if (labels) (result as any).labels = labels;
        if ((rating as any)[0]) {
            (result as any).rating = (rating as any)[0];
            (result as any).reviewCount = (rating as any)[0].totalReviews;
        }
   
        
        if (recentReviews) {
            
            const withCounts = await Promise.all(
                (recentReviews as any).map(async (review:any) => {
                    const userReviewCount = await this.reviewRepo.getCountByUserId(review.user._id);
                    return {
                        ...review,
                        createdAt: formatReviewDate(review.createdAt),
                        user: {
                            ...review.user,
                            reviewCount: (userReviewCount as any)[0]?.reviewCount || 0
                        }
                    };
                })
            );
            (result as any).recentReviews = withCounts;
        }

       if((userReview as any)[0]){
            (userReview as any)[0].createdAt=formatReviewDate((userReview as any)[0].createdAt),
            (result as any).userReview=(userReview as any)[0]
       }
        (result as any).isOpen = isRestaurantOpen((result as any).openingHours);
        const time = openingTime((result as any).openingHours);
        if (time) (result as any).openingTime = time;

    

        if (saveStatus) {
            (result as any).isSaved=true
        }
        else{
            (result as any).isSaved=false
        }

        return result;
    }



}

