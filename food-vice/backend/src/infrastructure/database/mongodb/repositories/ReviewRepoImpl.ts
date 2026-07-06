// 
import IReviewRepository from '../../../../application/interfaces/repositories/ReviewRepository'
const RatingModel = require('../models/Reviews/RatingModel')
const RestaurantReviews = require('../models/Reviews/ReviewModel')
const mongoose = require('mongoose')

class ReviewRepoImpl implements IReviewRepository {


    async getCountByUserId(userId: string) {
        return await RestaurantReviews.aggregate([
            { "$match": { "uid": new mongoose.Types.ObjectId(userId) } },
            { "$count": "reviewCount" }
        ]
        ).exec()
    }

    async getCountByRestId(restId: string) {
        return await RestaurantReviews.aggregate([
            { "$match": { "restaurantId": new mongoose.Types.ObjectId(restId) } },
            { "$count": "reviewCount" }
        ]
        ).exec()
    }

    async getRestaurantRating(restId: string) {
        return await RestaurantReviews.aggregate([
            { "$match": { "restaurantId": new mongoose.Types.ObjectId(restId) } },

            {
                "$lookup": {
                    "from": "ratings",
                    "localField": "_id",
                    "foreignField": "reviewId",
                    "as": "ratingDocs"
                }
            },
            { "$unwind": "$ratingDocs" },
            {
                "$group": {
                    "_id": "$restaurantId",
                    "overallRating": { "$avg": "$ratingDocs.overall" },
                    "foodRating": { "$avg": "$ratingDocs.food" },
                    "serviceRating": { "$avg": "$ratingDocs.service" },
                    "ambienceRating": { "$avg": "$ratingDocs.ambience" },
                    "valueRating": { "$avg": "$ratingDocs.price" },
                    "totalReviews": { "$sum": 1 }
                }
            }

        ]

        ).exec()
    }

    async getReviews({ restId, userId, cursor, limit = 3, currentUser = false }: { restId?: string; userId?: string; cursor?: any; limit?: number; currentUser?: boolean }) {
        const matchStage = {
            status: "approved"
        };
        if (restId) (matchStage as any).restaurantId = new mongoose.Types.ObjectId(restId);
        if (userId && currentUser) (matchStage as any).uid = new mongoose.Types.ObjectId(userId);
        if (userId && !currentUser) (matchStage as any).uid = { $ne: new mongoose.Types.ObjectId(userId) };

        return await RestaurantReviews.aggregate([
            { $match: matchStage },
            
            cursor ? { $match: { createdAt: { $lte: new Date(cursor.createdAt) } } } : {$match:{}},
            
            { $sort: { createdAt: -1 } },
            { $limit: limit + 1 },


            {
                $lookup: {
                    from: "users",
                    localField: "uid",
                    foreignField: "_id",
                    as: "user",
                },
            },
            { $unwind: "$user" },

            {
                $lookup: {
                    from: "media",
                    localField: "_id",
                    foreignField: "ownerId",
                    as: "photos",
                },
            },


            {
                $lookup: {
                    from: "reviewlikes",
                    let: { reviewId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$reviewId", "$$reviewId"] },
                                        { $eq: ["$uid", new mongoose.Types.ObjectId(userId)] },
                                    ],
                                },
                            },
                        },
                    ],
                    as: "likeStatus",
                },
            },
            {
                $addFields: {
                    isLikedByUser: { $gt: [{ $size: "$likeStatus" }, 0] },
                },
            },


            {
                $lookup: {
                    from: "reviewlikes",
                    localField: "_id",
                    foreignField: "reviewId",
                    as: "allLikes",
                },
            },
            {
                $addFields: {
                    likeCount: { $size: "$allLikes" },
                },
            },


            {
                $lookup: {
                    from: "ratings",
                    localField: "_id",
                    foreignField: "reviewId",
                    as: "ratingDocs",
                },
            },
            {
                $addFields: {
                    overallRating: { $avg: "$ratingDocs.overall" },
                },
            },

            {
                $project: {
                    _id: 1,
                    text: 1,
                    createdAt: 1,
                    restaurantId: 1,
                    "photos._id": 1,
                    "photos.url": 1,
                    "photos.caption": 1,
                    "user._id": 1,
                    "user.name": 1,
                    "user.username": 1,
                    "user.profilePhoto": 1,
                    "user.level": 1,
                    isLikedByUser: 1,
                    likeCount: 1,
                    overallRating: 1,
                },
            },
        ]).exec();
    }

    async getRecentReviews({ userId, cursor, limit = 3, currentUser = false }: { userId?: string; cursor?: any; limit?: number; currentUser?: boolean }) {


        const matchStage = {
            status: "approved"
        }

        if (userId && currentUser) (matchStage as any).uid = new mongoose.Types.ObjectId(userId);

        return await RestaurantReviews.aggregate([
            { $match: matchStage },

            cursor ? { $match: { createdAt: { $lte: new Date(cursor.createdAt) } } } : {$match:{}},
            
            { $sort: { createdAt: -1 } },
            
            { $limit: limit + 1 },

            {
                $lookup: {
                    from: "users",
                    localField: "uid",
                    foreignField: "_id",
                    as: "user",
                },
            },
            { $unwind: "$user" },
            {
                $lookup: {
                    from: "restaurants",
                    localField: "restaurantId",
                    foreignField: "_id",
                    as: "restaurant",
                },
            },
            { $unwind: "$restaurant" },

            {
                $lookup: {
                    from: "media",
                    localField: "_id",
                    foreignField: "ownerId",
                    as: "photos",
                },
            },


            {
                $lookup: {
                    from: "reviewlikes",
                    let: { reviewId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$reviewId", "$$reviewId"] },
                                        { $eq: ["$uid", new mongoose.Types.ObjectId(userId)] },
                                    ],
                                },
                            },
                        },
                    ],
                    as: "likeStatus",
                },
            },
            {
                $addFields: {
                    isLikedByUser: { $gt: [{ $size: "$likeStatus" }, 0] },
                },
            },


            {
                $lookup: {
                    from: "reviewlikes",
                    localField: "_id",
                    foreignField: "reviewId",
                    as: "allLikes",
                },
            },
            {
                $addFields: {
                    likeCount: { $size: "$allLikes" },
                },
            },


            {
                $lookup: {
                    from: "ratings",
                    localField: "_id",
                    foreignField: "reviewId",
                    as: "ratingDocs",
                },
            },
            {
                $addFields: {
                    overallRating: { $avg: "$ratingDocs.overall" },
                },
            },

            {
                $project: {
                    _id: 1,
                    text: 1,
                    createdAt: 1,
                    restaurantId: 1,
                    "restaurant.name": 1,
                    "restaurant._id": 1,
                    "photos._id": 1,
                    "photos.url": 1,
                    "photos.caption": 1,
                    "user._id": 1,
                    "user.name": 1,
                    "user.username": 1,
                    "user.profilePhoto": 1,
                    "user.level": 1,
                    isLikedByUser: 1,
                    likeCount: 1,
                    overallRating: 1,
                },

            },
            

        ]).exec();
    }


    async createReview({ userId, restaurantId, text }:{userId: string; restaurantId: string; text: string}) {
        return await RestaurantReviews.create({
            uid: new mongoose.Types.ObjectId(userId),
            restaurantId: new mongoose.Types.ObjectId(restaurantId),
            text,
        });
    }

    async createRating({ reviewId, food, service, ambience, price, overall }:{reviewId: string; food: number; service: number; ambience: number; price: number; overall: number}) {

        return await RatingModel.create({
            reviewId: new mongoose.Types.ObjectId(reviewId),
            food,
            service,
            ambience,
            price,
            overall,
        });
    }




    async getPending(limit = 20, filters = {}) {
        const query = { status: (filters as any).status || 'pending' };
        if ((filters as any).search) {
            (query as any).text = { $regex: (filters as any).search, $options: 'i' };
        }
        return await RestaurantReviews.find(query)
            .populate('uid', 'name username profilePhoto')
            .sort({ createdAt: -1 })
            .limit(limit)
            .lean();
    }

    async flagReview(reviewId: string, userId: string, reason: string) {
        return await RestaurantReviews.findByIdAndUpdate(
            reviewId,
            {
                $push: {
                    flags: {
                        userId: new mongoose.Types.ObjectId(userId),
                        reason,
                        createdAt: new Date()
                    }
                }
            },
            { new: true }
        ).lean();
    }

    async moderateReview(reviewId: string, moderatorId: string, action: string, note: string) {
        const status = action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'hidden';
        return await RestaurantReviews.findByIdAndUpdate(
            reviewId,
            {
                status,
                $push: {
                    moderationNotes: {
                        moderatorId: new mongoose.Types.ObjectId(moderatorId),
                        action,
                        note,
                        createdAt: new Date()
                    }
                }
            },
            { new: true }
        ).lean();
    }
}

export default ReviewRepoImpl