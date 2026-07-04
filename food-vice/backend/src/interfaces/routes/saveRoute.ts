import express from 'express'
import SaveController from '../controllers/saveController'

function createSaveRouter(saveController: SaveController) {

    const router = express.Router()

    router.post('/restaurant/:restId',saveController.saveRestaurant)
    router.post('/reel/:reelId',saveController.saveReel)

    return router
}

export default createSaveRouter
