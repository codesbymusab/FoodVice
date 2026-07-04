import express from 'express'
import multer from 'multer'
import ThreadController from '../controllers/threadController'
import { validateRequest, validateQueryParams } from '../middlewares/validationMiddleware'
import threadSchema from '../validators/thread.validator'
import { threadQuerySchema } from '../../application/dtos/input/Thread/ThreadQueryParams'
import { threadCommentSchema } from '../../application/dtos/input/Thread/ThreadCommentDTO'

const upload = multer({ storage: multer.memoryStorage() })

function createThreadRouter(threadController: ThreadController) {

    const router = express.Router()

    router.post('/', upload.array('media', 10), validateRequest(threadSchema), threadController.createThread)
    router.get('/community/all',validateQueryParams(threadQuerySchema), threadController.getAllThreads)
    router.post('/comment/:commentId/like', threadController.toggleCommentLike)
    router.get('/:id', threadController.getThreadById)
    router.get('/community/:communityId',validateQueryParams(threadQuerySchema) ,threadController.getThreadsByCommunity)
    router.post('/:id/like', threadController.likeThread)
    router.post('/:id/dislike', threadController.dislikeThread)
    router.post('/:id/comment', upload.array('media', 10),validateRequest(threadCommentSchema), threadController.addComment)
    router.get('/:id/comments', threadController.getComments)

    return router
}

export default createThreadRouter
