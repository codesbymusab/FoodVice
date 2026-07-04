import express from 'express'
import AuthController from '../controllers/authController'
import { validateRequest } from '../middlewares/validationMiddleware'
import registerSchema from '../validators/register.validator'
import loginSchema from '../validators/login.validator'
import { googleLoginSchema } from '../../application/dtos/input/Auth/GoogleLoginDTO'

function createAuthRouter(authController: AuthController) {

    const router = express.Router()

    router.post('/signup', validateRequest(registerSchema), authController.signupUser)
    router.post('/login', validateRequest(loginSchema), authController.loginUser)
    router.post('/google',validateRequest(googleLoginSchema), authController.googleSignIn)
    router.get('/signout', authController.signOut)

    return router
}

export default createAuthRouter

