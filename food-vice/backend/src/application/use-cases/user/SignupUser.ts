import { RegisterDTO } from "../../dtos/input/Auth/RegisterDTO";
import { IUserRepository } from "../../interfaces/repositories/UserRepository";

const bcrypt=require('bcrypt')

export default class SignupUser {
   constructor(private readonly userRepo:IUserRepository) {
          
      }

  async execute(dto:RegisterDTO) {
    
    

    const {email,password}=dto
          
    const hashedPassword = await bcrypt.hash(password, 10);

    
    return await this.userRepo.create({
      ...dto,
      password: hashedPassword,
      provider:'local'
    });
  }
}
