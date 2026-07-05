import { IUserRepository } from "../../interfaces/repositories/UserRepository";


export default class GetUserProfile {
    constructor(private readonly userRepo:IUserRepository) {
    
    }

    async execute({userId}:{userId:string}) {


        return await this.userRepo.getProfile(userId);


    }
}

module.exports = GetUserProfile;