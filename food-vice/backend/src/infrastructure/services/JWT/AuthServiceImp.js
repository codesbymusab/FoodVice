const jwt = require('jsonwebtoken')

class AuthServiceImpl {

    async getToken(userId) {


        return jwt.sign({ userId: userId },process.env.JWT_SECRET, {
            expiresIn:'30d'
        });

    }

    async verifyToken(token) {

        return jwt.verify(token,process.env.JWT_SECRET)
        

    }



}

module.exports = AuthServiceImpl