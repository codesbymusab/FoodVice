import { Request, Response } from 'express'
import SignupUser from '../../application/use-cases/user/SignupUser'
import LoginUser from '../../application/use-cases/user/LoginUser'
import GoogleSignIn from '../../application/use-cases/user/GoogleSignIn'

export default class AuthController {
    constructor(
        private signup: SignupUser,
        private login: LoginUser,
        private google: GoogleSignIn

    ) {
        this.signupUser = this.signupUser.bind(this)
        this.loginUser = this.loginUser.bind(this)
        this.googleSignIn = this.googleSignIn.bind(this)
        this.signOut = this.signOut.bind(this)
    }

    async signupUser(req: Request, res: Response) {

        try {


            const user = await this.signup.execute(req.validatedBody)

            if (user) {
                return res.status(201).json({ message: 'User created Successfully', user: user })
            }
            return res.status(400).json({ message: 'User creation failed' })
        }
        catch (error) {
            console.error(error)
            return res.status(400).json({ message: error })

        }



    }


    async loginUser(req: Request, res: Response) {

        try {


            const { user, token } = await this.login.execute(req.validatedBody)
            const isProd = process.env.ENVIRONMENT === 'Production';


            if (token) {
                res.cookie('token', token, { httpOnly: true, secure: isProd, sameSite: isProd ? 'none' : 'lax', maxAge: 7 * 24 * 60 * 60 * 1000, path: '/' })
                return res.status(201).json({ message: 'User logged in Successfully', user: user })
            }
            return res.status(400).json({ message: 'Login failed' })
        }
        catch (error) {
            console.error(error)
            return res.status(400).json({ message: error })

        }



    }


    async googleSignIn(req: Request, res: Response) {

        try {



            const { user, token } = await this.google.execute(req.validatedBody)
            const isProd = process.env.ENVIRONMENT === 'Production';


            if (token) {
                res.cookie('token', token, { httpOnly: true, secure: isProd, sameSite: isProd ? 'none' : 'lax', maxAge: 7 * 24 * 60 * 60 * 1000, path: '/' })
                return res.status(201).json({ message: 'User logged in Successfully', user: user })
            }
            return res.status(400).json({ message: 'Google sign-in failed' })
        }
        catch (error) {
            console.error(error)
            return res.status(400).json({ message: error })

        }



    }

    async signOut(req: Request, res: Response) {

        try {

            res.clearCookie('token')
            return res.status(201).json({ message: 'User logged out Successfully' })

        }
        catch (error) {
            console.error(error)
            return res.status(400).json({ message: error })

        }

    }

}



