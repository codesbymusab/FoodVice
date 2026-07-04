const User = require('../models/User/UserModel')
const mongoose = require('mongoose')
const Follow = require('../models/User/FollowModel')

class UserRepoImpl {

    async getByEmail(email) {

        return await User.findOne({ email })

    }
    async findById(userId) {
        return await User.findById(userId).lean();
    }

    async getById(userId) {

        return await User.aggregate([

            {
                $match: {
                    "_id": new mongoose.Types.ObjectId(userId)

                },

            },
            {
                $project: {
                    "userId": "$_id",
                    "name": "$name",
                    "username": "$username",
                    "email": "$email",
                    "profilePhoto": "$profilePhoto",
                    "level": "$level",
                    "address": "$address",
                    "bio": "$bio",
                    "role": "$role",
                    "banned": "$banned",
                    "banReason": "$banReason",
                    "banUntil": "$banUntil"

                }
            }



        ]).exec()



    }

    async getProfile(userId) {
        return await User.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(userId)
                }
            },

            
            {
                $project: {
                    userId: "$_id",
                    name: "$name",
                    username: "$username",
                    email: "$email",
                    profilePhoto: "$profilePhoto",
                    level: "$level",
                    address: "$address",
                    bio: "$bio",
                    provider: "$provider",
                    role: "$role",
                    banned: "$banned",
                    banReason: "$banReason",
                    banUntil: "$banUntil"
                }
            },

            {
                $lookup: {
                    from: "followers",
                    localField: "userId",
                    foreignField: "followingId",
                    as: "followers"
                }
            },

    
            {
                $lookup: {
                    from: "followers",
                    localField: "userId",
                    foreignField: "followerId",
                    as: "following"
                }
            },

         
            {
                $lookup: {
                    from: "savedrestaurants",
                    localField: "userId",
                    foreignField: "userId",
                    as: "savedRestaurants"
                }
            },

          
            {
                $lookup: {
                    from: "savedreels",
                    localField: "userId",
                    foreignField: "uid",
                    as: "savedReels"
                }
            },

       
            {
                $lookup: {
                    from: "reviews",
                    localField: "userId",
                    foreignField: "uid",
                    as: "reviews"
                }
            },

            {
                $addFields: {
                    followersCount: { $size: "$followers" },
                    followingCount: { $size: "$following" },
                    savedRestaurantsCount: { $size: "$savedRestaurants" },
                    savedReelsCount: { $size: "$savedReels" },
                    reviewsCount: { $size: "$reviews" }
                }
            },

            {
                $project: {
                    userId: 1,
                    name: 1,
                    username: 1,
                    email: 1,
                    profilePhoto: 1,
                    provider:1,
                    level: 1,
                    address: 1,
                    bio: 1,
                    followersCount: 1,
                    followingCount: 1,
                    savedRestaurantsCount: 1,
                    savedReelsCount: 1,
                    reviewsCount: 1
                }
            }
        ]).exec();

    }

    async getUsers({ role } = {}) {
        const query = {};
        if (role) query.role = role;
        return await User.find(query).lean();
    }

    async setRole(userId, role) {
        return await User.findByIdAndUpdate(userId, { role }, { new: true }).lean();
    }

    async banUser(userId, reason, until) {
        return await User.findByIdAndUpdate(
            userId,
            { banned: true, banReason: reason, banUntil: until || null },
            { new: true }
        ).lean();
    }

    async unbanUser(userId) {
        return await User.findByIdAndUpdate(
            userId,
            { banned: false, banReason: null, banUntil: null },
            { new: true }
        ).lean();
    }

    async create(user) {

        return await User.create(user)

    }
    async update(user, data) {

        return await User.updateOne({ _id: user._id }, { $set: data })
    }
    async delete(user) {
        throw new Error('Not Implemented')
    }

    async follow(followerId, followingId) {
        const existing = await Follow.findOne({
            followerId: new mongoose.Types.ObjectId(followerId),
            followingId: new mongoose.Types.ObjectId(followingId),
        });

        if (existing) {

            await Follow.deleteOne({ _id: existing._id });
            return { following: false };
        } else {

            await Follow.create({
                followerId: new mongoose.Types.ObjectId(followerId),
                followingId: new mongoose.Types.ObjectId(followingId),
            });
            return { following: true };
        }
    }
}

module.exports = UserRepoImpl