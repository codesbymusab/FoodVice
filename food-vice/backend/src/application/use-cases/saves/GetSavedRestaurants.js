const mongoose = require("mongoose");


class GetSavedRestaurants {

    constructor(restRepo) {
        this.restRepo = restRepo
    }
    async execute({ userId, limit = 10 }) {
        if (!userId) throw new Error("userId is required");

        return await this.restRepo.getSavedRestaurants(userId)
    }
}

module.exports = GetSavedRestaurants;
