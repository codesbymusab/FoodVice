import express from 'express'
import AIController from '../controllers/aiController'
import { validateRequest } from '../middlewares/validationMiddleware'
import { aiRecommendationsSchema } from '../../application/dtos/input/AI/RecommendationsDTO'
import { aiSummarySchema } from '../../application/dtos/input/AI/SummaryDTO'
import { aiChatSchema } from '../../application/dtos/input/AI/ChatDTO'

function createAIRouter(aiController: AIController) {
    
    const router = express.Router()

    router.post('/recommendations',validateRequest(aiRecommendationsSchema),aiController.aiRecommendations)
    router.post('/summary',validateRequest(aiSummarySchema),aiController.aiSummary)
    router.post('/chat',validateRequest(aiChatSchema),aiController.aiChat)

    return router
}

export default createAIRouter

