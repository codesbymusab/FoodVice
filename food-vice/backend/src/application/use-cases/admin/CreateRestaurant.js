class CreateRestaurant {
    constructor(restaurantRepo, auditService) {
        this.restaurantRepo = restaurantRepo;
        this.auditService = auditService;
    }

    async execute({ payload, userId, userRole }) {
        if (!payload.name) {
            throw new Error('Restaurant name is required');
        }

        const restaurant = await this.restaurantRepo.createRestaurant(payload);
        await this.auditService.logAction(userId, userRole, 'create_restaurant', 'restaurant', restaurant._id, payload);
        return restaurant;
    }
}

module.exports = CreateRestaurant;