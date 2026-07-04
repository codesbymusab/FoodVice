import express from 'express'
import multer from 'multer'
import UserController from '../controllers/userController'
import { validateRequest } from '../middlewares/validationMiddleware'
import profileSchema from '../validators/profile.validator'
import { followUserSchema } from '../../application/dtos/input/User/FollowUserDTO'

const upload = multer({ storage: multer.memoryStorage() })

function createUserRouter(userController: UserController) {

    const router = express.Router()

    router.put('/edit', upload.single('profilePhoto'), validateRequest(profileSchema), userController.editUser)
    router.get('/me', userController.getUser)
    router.get('/profile/:userId', userController.getUserProfile)
    router.post('/follow',validateRequest(followUserSchema),userController.toggleFollow)

    return router
}

export default createUserRouter
