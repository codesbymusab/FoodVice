import { FollowUserDTO } from "../../dtos/input/User/FollowUserDTO";
import { IUserRepository } from "../../interfaces/repositories/UserRepository";

const mongoose = require("mongoose");


export default class FollowUser {
    
    constructor(private readonly userRepo:IUserRepository) {
       
    }

    async execute(dto:FollowUserDTO) {
        

        return await this.userRepo.follow(dto.followerId, dto.followingId)


    }
}

