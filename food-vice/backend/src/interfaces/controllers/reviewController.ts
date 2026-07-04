import { ReviewDTO } from "../../application/dtos/input/Review/CreateReviewDTO"
import { ReviewQueryParams } from "../../application/dtos/input/Review/ReviewQueryParams"
import GetRecentReviews from "../../application/use-cases/reviews/GetRecentReviews"
import GetRestaurantReviews from "../../application/use-cases/reviews/GetRestaurantReviews"
import GetUserReviews from "../../application/use-cases/reviews/GetUserReviews"
import ReviewRestaurant from "../../application/use-cases/reviews/ReviewRestaurant"
import {Request,Response} from 'express'
export default class ReviewController {

    constructor(
        private getRestaurantReviews: GetRestaurantReviews,
        private getrecentReviews: GetRecentReviews,
        private getUserReviews: GetUserReviews,
        private reviewRestaurant: ReviewRestaurant
    ) {
        this.restReviews = this.restReviews.bind(this)
        this.recentReviews = this.recentReviews.bind(this)
        this.userReviews = this.userReviews.bind(this)
        this.createReview = this.createReview.bind(this)

    }


    async restReviews(req:Request,res:Response) {
        try {
            const restId = req.params.restaurantId
            const { cursor, limit } = req.validatedQuery as ReviewQueryParams

          

            const result = await this.getRestaurantReviews.execute({ restId, cursor, limit})

            if (result) {
                return res.status(200).json({ success: true, message: 'Restaurant reviews', ...result });
            }

            return res.status(400).json({ message: 'Failed to load reviews' });
        }
        catch (error) {
            console.error(error)
            return res.status(400).json({ message: error })
        }
    }


    async recentReviews(req:Request,res:Response) {
        try {


            const { cursor, limit } = req.validatedQuery as ReviewQueryParams
            const userId=(req as any).userId
           

            const result = await this.getrecentReviews.execute({ userId, cursor, limit})

            if (result) {
                return res.status(200).json({ success: true, message: 'Recent reviews', ...result });

            }

            return res.status(400).json({ message: 'Failed to load recent reviews' });
        }
        catch (error) {
            console.error(error)
            return res.status(400).json({ message: error })
        }
    }


    async userReviews(req:Request,res:Response) {
        try {

            const userId = req.params.userId
            const { cursor, limit } = req.validatedQuery as ReviewQueryParams
            
            const result = await this.getUserReviews.execute({ userId, cursor, limit})

            if (result) {
                return res.status(200).json(result);
            }

            return res.status(400).json({ message: 'Failed to load user reviews' });
        }
        catch (error) {
            console.error(error)
            return res.status(400).json({ message: error })
        }
    }

    async createReview(req:Request,res:Response) {
        try {
            const { userId, restaurantId, text, rating } = req.validatedBody as ReviewDTO
            const formattedRating = typeof req.validatedBody!.rating === "string" ? JSON.parse(req.validatedBody!.rating) : req.validatedBody!.rating;

            const files = req.files;

            const result = await this.reviewRestaurant.execute({
                userId,
                restaurantId,
                text,
                rating: formattedRating,
                files
            });

            return res.status(201).json(result);
        } catch (err) {
            console.error(err);
            return res.status(400).json({ error: err });
        }
    }
} 
