import express from 'express'
import multer from 'multer'
import ReelController from '../controllers/reelController'
import { logRequest, validateQueryParams, validateRequest } from '../middlewares/validationMiddleware'
import { popularTagsQuerySchema, reelQuerySchema, suggestedAccQuerySchema, userReelQuerySchema } from '../../application/dtos/input/Reel/ReelQueryParams'
import reelSchema from '../validators/reel.validator'

function createReelRouter(reelController: ReelController) {

    const router = express.Router()
    const upload = multer({ storage: multer.memoryStorage() })

    router.post('/upload', upload.single('file'), validateRequest(reelSchema), reelController.upload)
    router.get('/:userId',logRequest,validateQueryParams(userReelQuerySchema), reelController.userReels)
    router.get('/reel/:reelId/:userId', reelController.get)
    router.get('/recent/reels',validateQueryParams(reelQuerySchema), reelController.recent)
    router.get('/followers/reels',validateQueryParams(reelQuerySchema),reelController.followerReels)
    router.get('/suggestions/accounts',validateQueryParams(suggestedAccQuerySchema),reelController.suggestAcc)
    router.get('/tags/popular',validateQueryParams(popularTagsQuerySchema),reelController.popularTags)
    router.post('/:reelId/view',reelController.updateViews)

    return router
}

export default createReelRouter
