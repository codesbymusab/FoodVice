import { Request, Response } from 'express'
import RestaurantRepoImpl from '../../infrastructure/database/mongodb/repositories/RestaurantRepoImpl'
import UserRepoImpl from '../../infrastructure/database/mongodb/repositories/UserRepoImpl'
import AuditService from '../../infrastructure/services/AuditService'
import AuditLogRepoImpl from '../../infrastructure/database/mongodb/repositories/AuditLogRepoImpl'
import { UserRoles } from '../../shared/utils/moderationConstants'
import { AdminRestaurantQueryParams, AdminSetUserRoleDTO, AdminUsersQueryParams, AdmminAuditLogsQueryParams } from '../../application/dtos/input/Admin/AdminRestaurantsQueryParams'

export default class AdminController {
  constructor(
    private restaurantRepo: RestaurantRepoImpl,
    private userRepo: UserRepoImpl,
    private auditService: AuditService,
    private auditLogRepo: AuditLogRepoImpl
  ) {
    this.getRestaurants = this.getRestaurants.bind(this)
    this.createRestaurant = this.createRestaurant.bind(this)
    this.updateRestaurant = this.updateRestaurant.bind(this)
    this.deleteRestaurant = this.deleteRestaurant.bind(this)
    this.getUsers = this.getUsers.bind(this)
    this.setUserRole = this.setUserRole.bind(this)
    this.getAuditLogs = this.getAuditLogs.bind(this)
  }

  getRestaurants = async (req: Request, res: Response) => {
    try {
      const filters = {
        status: req.validatedQuery!.status ,
        flagged: req.validatedQuery!.flagged,
        search: req.validatedQuery!.search
      }
      const {page,limit} =req.validatedQuery as AdminRestaurantQueryParams
      
      const restaurants = await this.restaurantRepo.getAll(filters, page, limit)
      return res.status(200).json({ success: true, data: restaurants })
    } catch (error) {
      console.error(error)
      return res.status(400).json({ success: false, error: error instanceof Error ? error.message : 'Failed to load restaurants' })
    }
  }

  createRestaurant = async (req: Request, res: Response) => {
    try {
      const payload = req.validatedBody
      if (!payload!.name) {
        return res.status(400).json({ success: false, error: 'Restaurant name is required' })
      }

      const restaurant = await this.restaurantRepo.createRestaurant(payload)
      await this.auditService.logAction((req as any).userId, (req as any).userRole, 'create_restaurant', 'restaurant', restaurant._id, payload)
      return res.status(201).json({ success: true, data: restaurant })
    } catch (error) {
      console.error(error)
      return res.status(400).json({ success: false, error: error instanceof Error ? error.message : 'Failed to create restaurant' })
    }
  }

  updateRestaurant = async (req: Request, res: Response) => {
    try {
      const restaurantId = req.params.id
      const payload = req.validatedBody

      const restaurant = await this.restaurantRepo.updateRestaurant(restaurantId, payload)
      if (!restaurant) {
        return res.status(404).json({ success: false, error: 'Restaurant not found' })
      }

      await this.auditService.logAction((req as any).userId, (req as any).userRole, 'update_restaurant', 'restaurant', restaurantId, payload)
      return res.status(200).json({ success: true, data: restaurant })
    } catch (error) {
      console.error(error)
      return res.status(400).json({ success: false, error: error instanceof Error ? error.message : 'Failed to update restaurant' })
    }
  }

  deleteRestaurant = async (req: Request, res: Response) => {
    try {
      const restaurantId = req.params.id
      const deleted = await this.restaurantRepo.deleteRestaurant(restaurantId)
      if (!deleted) {
        return res.status(404).json({ success: false, error: 'Restaurant not found' })
      }

      await this.auditService.logAction((req as any).userId, (req as any).userRole, 'delete_restaurant', 'restaurant', restaurantId, {})
      return res.status(200).json({ success: true, data: deleted })
    } catch (error) {
      console.error(error)
      return res.status(400).json({ success: false, error: error instanceof Error ? error.message : 'Failed to delete restaurant' })
    }
  }

  getUsers = async (req: Request, res: Response) => {
    try {
      const {role} = req.validatedQuery as AdminUsersQueryParams
      const users = await this.userRepo.getUsers({ role })
      return res.status(200).json({ success: true, data: users })
    } catch (error) {
      console.error(error)
      return res.status(400).json({ success: false, error: error instanceof Error ? error.message : 'Failed to load users' })
    }
  }

  setUserRole = async (req: Request, res: Response) => {
    try {
      const userId = req.params.id
      const { role } = req.validatedBody as AdminSetUserRoleDTO
      if (!role || !Object.values(UserRoles).includes(role)) {
        return res.status(400).json({ success: false, error: 'Invalid role' })
      }

      const user = await this.userRepo.setRole(userId, role)
      if (!user) {
        return res.status(404).json({ success: false, error: 'User not found' })
      }

      await this.auditService.logAction((req as any).userId, (req as any).userRole, 'set_user_role', 'user', userId, { role })
      return res.status(200).json({ success: true, data: user })
    } catch (error) {
      console.error(error)
      return res.status(400).json({ success: false, error: error instanceof Error ? error.message : 'Failed to set user role' })
    }
  }

  getAuditLogs = async (req: Request, res: Response) => {
    try {
      const {page,limit} = req.validatedQuery as AdmminAuditLogsQueryParams
      const logs = await this.auditLogRepo.getPaginated({ page, limit })
      return res.status(200).json({ success: true, data: logs })
    } catch (error) {
      console.error(error)
      return res.status(400).json({ success: false, error: error instanceof Error ? error.message : 'Failed to load audit logs' })
    }
  }
}
