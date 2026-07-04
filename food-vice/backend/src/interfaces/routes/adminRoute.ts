import express from 'express'
import AdminController from '../controllers/adminController'
import { verifyAuth, requireRole } from '../middlewares/authMiddleware'
import { validateQueryParams, validateRequest } from '../middlewares/validationMiddleware'
import {
  adminRestaurantQuerySchema,
  adminAuditLogsQuerySchema,
  adminUsersQuerySchema,
  adminCreateRestaurantSchema,
  adminUpdateRestaurantSchema,
  adminSetUserRoleSchema,
} from '../../application/dtos/input/Admin/AdminRestaurantsQueryParams'

function createAdminRouter(adminController: AdminController) {
    
    const router = express.Router()

    router.use(verifyAuth)
    router.use(requireRole(['admin']))

    router.get('/restaurants', validateQueryParams(adminRestaurantQuerySchema), adminController.getRestaurants)
    router.post('/restaurants', validateRequest(adminCreateRestaurantSchema), adminController.createRestaurant)
    router.put('/restaurants/:id', validateRequest(adminUpdateRestaurantSchema), adminController.updateRestaurant)
    router.delete('/restaurants/:id', adminController.deleteRestaurant)
    router.get('/users', validateQueryParams(adminUsersQuerySchema), adminController.getUsers)
    router.put('/users/:id/role', validateRequest(adminSetUserRoleSchema), adminController.setUserRole)
    router.get('/audit-logs', validateQueryParams(adminAuditLogsQuerySchema), adminController.getAuditLogs)

    return router
}

export default createAdminRouter
