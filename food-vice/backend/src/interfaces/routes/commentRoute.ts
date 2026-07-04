import express from 'express'
import CommentController from '../controllers/commentController'
import { validateQueryParams, validateRequest } from '../middlewares/validationMiddleware'
import { commentSchema } from '../../application/dtos/input/Comment/CommentDTO'

function createCommentRouter(commentController: CommentController) {
    
    const router = express.Router()

    router.get('/:reelId', commentController.getComments)
    router.post('/:reelId',validateRequest(commentSchema), commentController.postComment)

    return router
}

export default createCommentRouter
