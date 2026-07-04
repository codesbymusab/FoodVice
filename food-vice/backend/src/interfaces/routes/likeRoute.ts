import express from 'express'
import LikeController from '../controllers/likeController'


function createLikeRouter(likeController: LikeController) {
  const router = express.Router()

  router.post('/review/:reviewId', likeController.review)
  router.post('/reel/:reelId', likeController.reel)
  router.post('/reel/comment/:commentId', likeController.reelComment)

  return router
}

export default createLikeRouter
