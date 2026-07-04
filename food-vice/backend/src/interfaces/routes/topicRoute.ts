import express from 'express'
import TopicController from '../controllers/topicController'
import { validateQueryParams, validateRequest } from '../middlewares/validationMiddleware'
import { threadTopicSchema } from '../../application/dtos/input/Thread/ThreadTopicDTO'

function createTopicRouter(topicController: TopicController) {

    const router = express.Router()

    router.get('/', topicController.getAllTopics)
    router.post('/',validateRequest(threadTopicSchema),topicController.createTopic)
    router.get('/:id', topicController.getTopicById)

    return router
}

export default createTopicRouter
