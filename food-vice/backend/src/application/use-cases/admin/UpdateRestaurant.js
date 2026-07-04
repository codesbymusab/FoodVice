class UpdateRestaurant {
    constructor(restaurantRepo, auditService) {
        this.restaurantRepo = restaurantRepo;
        this.auditService = auditService;
    }

    async execute({ restaurantId, payload, userId, userRole }) {
        const restaurant = await this.restaurantRepo.updateRestaurant(restaurantId, payload);
        if (!restaurant) {
            throw new Error('Restaurant not found');
        }

        await this.auditService.logAction(userId, userRole, 'update_restaurant', 'restaurant', restaurantId, payload);
        return restaurant;
    }
}

module.exports = UpdateRestaurant;