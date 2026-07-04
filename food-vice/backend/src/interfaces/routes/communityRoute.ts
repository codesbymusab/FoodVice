import express from 'express'
import multer from 'multer'
import CommunityController from '../controllers/communityController'
import { validateRequest, validateQueryParams } from '../middlewares/validationMiddleware'
import communitySchema from '../validators/community.validator'
import { communityQuerySchema } from '../../application/dtos/input/Community/CommunityQueryParams'

const upload = multer({ storage: multer.memoryStorage() })

function createCommunityRouter(communityController: CommunityController) {
    
    const router = express.Router()

    router.post('/', upload.single('coverPhoto'), validateRequest(communitySchema), communityController.createCommunity)
    router.get('/', validateQueryParams(communityQuerySchema), communityController.getCommunities)
    router.get('/joined', communityController.getJoinedCommunities)
    router.get('/recommended', communityController.getRecommendedCommunities)
    router.get('/:id', communityController.getCommunityById)
    router.post('/:id/join', communityController.joinCommunity)

    return router
}

export default createCommunityRouter
