class GetCusines
{
    constructor(restaurantRepo) {
        this.restaurantRepo = restaurantRepo;
    }

    async execute() {
        return this.restaurantRepo.getCuisines()
    }


}

module.exports = GetCusines