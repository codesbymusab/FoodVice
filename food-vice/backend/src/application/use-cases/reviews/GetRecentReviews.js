const { cursorPaginateReviews } = require('../../../shared/utils/cursorPagination');
const {formatReviewDate}=require('../../../shared/utils/dateFormatter')
class GetRecentReviews {
    constructor(reviewRepo) {
        this.reviewRepo = reviewRepo
    }

    async execute({userId,cursor,limit}) {

        
        const result = {};

        let limitCap=limit
        
        if(limit && limit>100){
            limitCap=100
        }

        const reviews = await this.reviewRepo.getRecentReviews({userId,cursor: cursor,limit:limitCap})
       
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


        return cursorPaginateReviews(result.reviews,limitCap);
    }



}

module.exports = GetRecentReviews