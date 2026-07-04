import express from 'express'
import multer from 'multer'
import ReviewController from '../controllers/reviewController'
import { validateQueryParams, validateRequest } from '../middlewares/validationMiddleware'
import reviewSchema from '../validators/review.validator'
import { reviewQuerySchema } from '../../application/dtos/input/Review/ReviewQueryParams'

function createReviewRouter(reviewController: ReviewController) {

    const router = express.Router()

    const upload = multer({ storage: multer.memoryStorage() })

    router.get('/recent', validateQueryParams(reviewQuerySchema),reviewController.recentReviews)
    router.get('/:restaurantId', validateQueryParams(reviewQuerySchema),reviewController.restReviews)
    router.get('/user/:userId', validateQueryParams(reviewQuerySchema),reviewController.userReviews)
    router.post('/create', upload.array('files'), validateRequest(reviewSchema), reviewController.createReview)

    return router
}

export default createReviewRouter