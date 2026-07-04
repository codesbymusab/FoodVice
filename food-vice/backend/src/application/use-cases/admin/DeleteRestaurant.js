class DeleteRestaurant {
    constructor(restaurantRepo, auditService) {
        this.restaurantRepo = restaurantRepo;
        this.auditService = auditService;
    }

    async execute({ restaurantId, userId, userRole }) {
        const deleted = await this.restaurantRepo.deleteRestaurant(restaurantId);
        if (!deleted) {
            throw new Error('Restaurant not found');
        }

        await this.auditService.logAction(userId, userRole, 'delete_restaurant', 'restaurant', restaurantId, {});
        return deleted;
    }
}

module.exports = DeleteRestaurant;