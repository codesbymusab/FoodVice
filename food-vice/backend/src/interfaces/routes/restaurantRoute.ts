import express from 'express'
import RestaurantController from '../controllers/restaurantController'
import { validateQueryParams } from '../middlewares/validationMiddleware'
import { postViewQuerySchema, restDetailsQuerySchema, restListQuerySchema, similarRestQuerySchema } from '../../application/dtos/input/Restaurant/RestaurantQueryParams'

function createRestaurantRouter(restaurantController: RestaurantController) {
  const router = express.Router()

  router.get('/recommended',validateQueryParams(restListQuerySchema),restaurantController.recommendedRest)
  router.get('/toprated',validateQueryParams(restListQuerySchema),restaurantController.topRatedRest)
  router.get('/nearby',validateQueryParams(restListQuerySchema),restaurantController.nearbyRest)
  router.get('/details/:id',validateQueryParams(restDetailsQuerySchema), restaurantController.restDetails)
  router.get('/similar/:id',validateQueryParams(similarRestQuerySchema), restaurantController.similarRest)
  router.get('/cuisines', restaurantController.restCuisines)
  router.get('/photos/:id', restaurantController.restPhotos)
  router.get('/saved', restaurantController.savedRestaurants)
  router.get('/trending',validateQueryParams(restListQuerySchema),restaurantController.trendingRestaurants)
  router.post('/:id/view',validateQueryParams(postViewQuerySchema),restaurantController.postView)

  return router
}

export default createRestaurantRouter

