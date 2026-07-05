// @ts-nocheck
import IAuthService from '../../../application/interfaces/services/AuthService'
const jwt = require('jsonwebtoken')

class AuthServiceImpl implements IAuthService {

    async getToken(userId) {


        return jwt.sign({ userId: userId },process.env.JWT_SECRET, {
            expiresIn:'30d'
        });

    }

    async verifyToken(token) {

        return jwt.verify(token,process.env.JWT_SECRET)
        

    }



}

export default AuthServiceImpl