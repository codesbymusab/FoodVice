import { LoginDTO } from "../../dtos/input/Auth/LoginDTO";
import { IUserRepository } from "../../interfaces/repositories/UserRepository";
import IAuthService from "../../interfaces/services/AuthService";

const bcrypt = require('bcrypt')

export default class LoginUser {
     constructor(private readonly userRepo:IUserRepository,private readonly authRepo:IAuthService) {
            
     }  

    async execute(dto:LoginDTO) {


        const { email, password } = dto
        const user = await this.userRepo.getByEmail(email)

        if (!user) {
            throw new Error("User not found")
        }
        const match = await bcrypt.compare(password, (user as any).password);

        if (!match) {
            throw new Error("Incorrect password")
        }

        const token = await this.authRepo.getToken((user as any)._id)

        return { user: { userId: (user as any)._id, name: (user as any).name, email, username: (user as any).username, role: (user as any).role, banned: (user as any).banned, banReason: (user as any).banReason, banUntil: (user as any).banUntil }, token: token }

    }
}

