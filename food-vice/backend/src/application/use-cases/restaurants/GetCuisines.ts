import IRestaurantRepository from "../../interfaces/repositories/RestaurantRepository";

export default class GetCusines
{
    constructor(private readonly restaurantRepo:IRestaurantRepository) {
        
    }

    async execute({restId}:{restId?:string}) {
        return this.restaurantRepo.getCuisines(restId)
    }


}
