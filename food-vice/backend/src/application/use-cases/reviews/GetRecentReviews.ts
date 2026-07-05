import { ReviewQueryParams } from "../../dtos/input/Review/ReviewQueryParams";
import IReviewRepository from "../../interfaces/repositories/ReviewRepository";

const { cursorPaginateReviews } = require('../../../shared/utils/cursorPagination');
const {formatReviewDate}=require('../../../shared/utils/dateFormatter')
export default class GetRecentReviews {
    
    constructor(private readonly reviewRepo:IReviewRepository) {
        
    }

    async execute(userId:string,query:ReviewQueryParams) {

        
        const result = {};
        const { limit, cursor, sortBy}= query
        let limitCap=limit
        
        if(limit && limit>100){
            limitCap=100
        }

        const reviews = await this.reviewRepo.getRecentReviews({userId,cursor,limit:limitCap})
       
        if (reviews) {
            
            const withCounts = await Promise.all(
                    (reviews as any).map(async (review:any) => {
                    const userReviewCount = await this.reviewRepo.getCountByUserId(review.user._id);
                    return {
                        ...review,
                        createdAtUnformatted: review.createdAt,
                        createdAt: formatReviewDate(review.createdAt),
                        user: {
                            ...review.user,
                            reviewCount: (userReviewCount as any)[0] ?.reviewCount || 0
                        }
                    };
                })
            );
            (result as any).reviews = withCounts;
        }


        return cursorPaginateReviews((result as any).reviews,limitCap);
    }



}

