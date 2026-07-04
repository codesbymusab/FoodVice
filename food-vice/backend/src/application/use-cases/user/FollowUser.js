const mongoose = require("mongoose");


class FollowUser {
    constructor(userRepo) {
        this.userRepo = userRepo
    }

    async execute({ followerId, followingId }) {
        if (!followerId || !followingId) {
            throw new Error("Both followerId and followingId are required");
        }

        return await this.userRepo.follow(followerId, followingId)


    }
}

module.exports = FollowUser