// @ts-nocheck
import IAuthService from '../../../application/interfaces/services/AuthService'
const {
  OAuth2Client,
} = require('google-auth-library');

class AuthServiceImpl implements IAuthService {
    
    async getToken(code) {

        const oAuth2Client = new OAuth2Client(
            process.env.CLIENT_ID,
            process.env.CLIENT_SECRET,
            'postmessage',
        );


        const { tokens } = await oAuth2Client.getToken(code);

        return tokens

    }

    async verifyToken(access_token) {


        const res = await fetch(
            'https://www.googleapis.com/oauth2/v3/userinfo',
            {
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            }
        );

        const data = await res.json()

        return data;
    }



}

export default AuthServiceImpl