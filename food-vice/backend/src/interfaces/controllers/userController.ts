import { Request, Response } from 'express'
import EditUserProfile from '../../application/use-cases/user/EditUserProfile'
import FollowUser from '../../application/use-cases/user/FollowUser'
import GetUser from '../../application/use-cases/user/GetUser'
import GetUserProfile from '../../application/use-cases/user/GetUserProfile'
import { FollowUserDTO } from '../../application/dtos/input/User/FollowUserDTO'

export default class UserController {
  constructor(
    private getUserUseCase: GetUser,
    private getUserProfileUseCase: GetUserProfile,
    private editUserUseCase: EditUserProfile,
    private followUserUseCase: FollowUser
  ) {
    this.getUser = this.getUser.bind(this)
    this.getUserProfile = this.getUserProfile.bind(this)
    this.editUser = this.editUser.bind(this)
    this.toggleFollow = this.toggleFollow.bind(this)
  }

  getUser = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).userId
      const user = await this.getUserUseCase.execute({ userId })

      if (user) {
        return res.status(200).json({ user })
      }

      return res.status(400).json({ message: 'User not logged in' })
    } catch (error) {
      console.error(error)
      if (!res.headersSent) {
        return res.status(400).json({ message: error instanceof Error ? error.message : 'Failed to load user' })
      }
    }
  }

  getUserProfile = async (req: Request, res: Response) => {
    try {
      const profile = await this.getUserProfileUseCase.execute({ userId: req.params.userId })

      if (profile?.[0]) {
        return res.status(200).json(profile[0])
      }

      return res.status(400).json({ message: 'Failed to load profile' })
    } catch (error) {
      console.error(error)
      return res.status(400).json({ message: error instanceof Error ? error.message : 'Failed to load profile' })
    }
  }

  editUser = async (req: Request, res: Response) => {
    try {
      const file = req.file
      await this.editUserUseCase.execute({ ...req.validatedBody, file })

      return res.status(200).json({ message: 'User updated Successfully' })
    } catch (error) {
      console.error(error)
      if (!res.headersSent) {
        return res.status(400).json({ message: error instanceof Error ? error.message : 'User update failed' })
      }
    }
  }

  toggleFollow = async (req: Request, res: Response) => {
    try {
      const result = await this.followUserUseCase.execute(req.validatedBody as FollowUserDTO)
      return res.status(200).json(result)
    } catch (error) {
      console.error(error)
      return res.status(400).json({ error: error instanceof Error ? error.message : 'Failed to toggle follow' })
    }
  }
}

