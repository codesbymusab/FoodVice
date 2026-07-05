import IRestaurantRepository from "../../interfaces/repositories/RestaurantRepository";

const mongoose = require("mongoose");


export default class GetSavedRestaurants {

    constructor(private readonly restRepo:IRestaurantRepository) {
        
    }
    async execute({ userId, limit = 10 }:{userId:string,limit?:number}) {
        
        return await this.restRepo.getSavedRestaurants(userId)
    }
}

