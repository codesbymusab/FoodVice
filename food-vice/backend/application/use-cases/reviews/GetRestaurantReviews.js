const { cursorPaginateReviews, decodeCursor } = require("../../../shared/utils/cursorPagination");
const { formatReviewDate } = require("../../../shared/utils/dateFormatter");

class GetRestaurantReviews {
    constructor(reviewRepo) {
        this.reviewRepo = reviewRepo
    }

    async execute({restId,cursor,limit}) {

          
        if (!restId) {
            throw new Error("Restaurant id required");
        }

        const result = {};

        let limitCap=limit

        if(limit && limit>100){
            limitCap=100
        }

        const reviews = await this.reviewRepo.getReviews({restId,cursor: cursor ? decodeCursor(cursor) : undefined,limit:limitCap})
        
        
        if (reviews) {
            
            const withCounts = await Promise.all(
                    reviews.map(async (review) => {
                    const userReviewCount = await this.reviewRepo.getCountByUserId(review.user._id);
                    return {
                        ...review,
                        createdAtUnformatted: review.createdAt,
                        createdAt: formatReviewDate(review.createdAt),
                        user: {
                            ...review.user,
                            reviewCount: userReviewCount[0]?.reviewCount || 0
                        }
                    };
                })
            );
            result.reviews = withCounts;
        }


        return cursorPaginateReviews(result.reviews,limitCap)
    }



}

module.exports = GetRestaurantReviews