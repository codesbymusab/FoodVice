import { GoogleLoginDTO } from "../../dtos/input/Auth/GoogleLoginDTO"
import { IUserRepository } from "../../interfaces/repositories/UserRepository"
import IAuthService from "../../interfaces/services/AuthService"

export default class GoogleSignIn {

    constructor(private readonly userRepo:IUserRepository,private readonly oAuthRepo:IAuthService,private readonly jwtAuthRepo:IAuthService) {
        
    }

    async execute(dto:GoogleLoginDTO) {

        const userData = await this.oAuthRepo.verifyToken(dto.access_token)

        if (!(userData as any)) {
            throw new Error('User not found')
        }

        let user = await this.userRepo.getByEmail((userData as any).email) 

        if (!user) {
          
            user=await this.userRepo.create({
                name: (userData as any).name,
                email: (userData as any).email,
                username: `@${(userData as any).email.slice(0,((userData as any).email.length-10))}`,
                provider:'google',
                profilePhoto: (userData as any).picture
            })
        }

        if (user && (user as any).provider === "local") {
            throw new Error("Please login using email/password");
        }

         const token = await this.jwtAuthRepo.getToken((user as any)._id)

        return { user: { userId: (user as any)._id, name:(user as any).name, email: (user as any).email, username: (user as any).username, role: (user as any).role, banned: (user as any).banned, banReason: (user as any).banReason, banUntil: (user as any).banUntil }, token: token }

    }
}

