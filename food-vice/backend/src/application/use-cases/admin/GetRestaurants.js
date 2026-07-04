class GetRestaurants {
    constructor(restaurantRepo) {
        this.restaurantRepo = restaurantRepo;
    }

    async execute({ filters = {}, page = 1, limit = 20 }) {
        return await this.restaurantRepo.getAll(filters, page, limit);
    }
}

module.exports = GetRestaurants;