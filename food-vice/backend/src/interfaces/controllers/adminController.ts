import { Request, Response } from 'express'
import { AdminCreateRestDTO, AdminRestaurantQueryParams, AdminSetUserRoleDTO, AdminUsersQueryParams, AdmminAuditLogsQueryParams } from '../../application/dtos/input/Admin/AdminRestaurantsQueryParams'
import GetRestaurants from '../../application/use-cases/admin/GetRestaurants'
import CreateRestaurant from '../../application/use-cases/admin/CreateRestaurant'
import UpdateRestaurant from '../../application/use-cases/admin/UpdateRestaurant'
import DeleteRestaurant from '../../application/use-cases/admin/DeleteRestaurant'
import GetUsers from '../../application/use-cases/admin/GetUsers'
import SetUserRole from '../../application/use-cases/admin/SetUserRole'
import GetAuditLogs from '../../application/use-cases/admin/GetAuditLogs'

export default class AdminController {
  constructor(
    private getRestaurantsUseCase: GetRestaurants,
    private createRestaurantUseCase: CreateRestaurant,
    private updateRestaurantUseCase: UpdateRestaurant,
    private deleteRestaurantUseCase: DeleteRestaurant,
    private getUsersUseCase: GetUsers,
    private setUserRoleUseCase: SetUserRole,
    private getAuditLogsUseCase: GetAuditLogs
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

      const restaurants = await this.getRestaurantsUseCase.execute(req.validatedQuery as AdminRestaurantQueryParams)
      return res.status(200).json({ success: true, data: restaurants })
    } catch (error) {
      console.error(error)
      return res.status(400).json({ success: false, error: error instanceof Error ? error.message : 'Failed to load restaurants' })
    }
  }

  createRestaurant = async (req: Request, res: Response) => {
    try {
      const payload = req.validatedBody as AdminCreateRestDTO

      const restaurant = await this.createRestaurantUseCase.execute({
        payload,
        userId: req.userId as string,
        userRole: req.userRole as string
      })
      return res.status(201).json({ success: true, data: restaurant })
    } catch (error) {
      console.error(error)
      return res.status(400).json({ success: false, error: error instanceof Error ? error.message : 'Failed to create restaurant' })
    }
  }

  updateRestaurant = async (req: Request, res: Response) => {
    try {
      const payload = req.validatedBody as AdminCreateRestDTO
      const restaurantId=req.params.id as string
      const restaurant = await this.updateRestaurantUseCase.execute({
        restaurantId,
        payload,
        userId: req.userId as string,
        userRole: req.userRole as string
      })
      return res.status(200).json({ success: true, data: restaurant })
    } catch (error) {
      console.error(error)
      return res.status(400).json({ success: false, error: error instanceof Error ? error.message : 'Failed to update restaurant' })
    }
  }

  deleteRestaurant = async (req: Request, res: Response) => {
    try {
      const restaurantId = req.params.id as string
        
      const deleted = await this.deleteRestaurantUseCase.execute({
        restaurantId,
        userId: req.userId as string,
        userRole: req.userRole as string
      })
      return res.status(200).json({ success: true, data: deleted })
    } catch (error) {
      console.error(error)
      return res.status(400).json({ success: false, error: error instanceof Error ? error.message : 'Failed to delete restaurant' })
    }
  }

  getUsers = async (req: Request, res: Response) => {
    try {
      const { role } = req.validatedQuery as AdminUsersQueryParams
      const users = await this.getUsersUseCase.execute({ role })
      return res.status(200).json({ success: true, data: users })
    } catch (error) {
      console.error(error)
      return res.status(400).json({ success: false, error: error instanceof Error ? error.message : 'Failed to load users' })
    }
  }

  setUserRole = async (req: Request, res: Response) => {
    try {

      const userId = req.userId as string
      
      const { role } = req.validatedQuery as AdminSetUserRoleDTO
      const user = await this.setUserRoleUseCase.execute({
        userId,
        role,
        currentUserId: req.userId as string,
        currentUserRole: req.userRole as string
      })
      return res.status(200).json({ success: true, data: user })
    } catch (error) {
      console.error(error)
      return res.status(400).json({ success: false, error: error instanceof Error ? error.message : 'Failed to set user role' })
    }
  }

  getAuditLogs = async (req: Request, res: Response) => {
    try {
      const { page, limit } = req.validatedQuery as AdmminAuditLogsQueryParams
      const logs = await this.getAuditLogsUseCase.execute({ page, limit })
      return res.status(200).json({ success: true, data: logs })
    } catch (error) {
      console.error(error)
      return res.status(400).json({ success: false, error: error instanceof Error ? error.message : 'Failed to load audit logs' })
    }
  }
}
