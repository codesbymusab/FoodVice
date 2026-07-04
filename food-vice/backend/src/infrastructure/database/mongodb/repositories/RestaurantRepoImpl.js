const Restaurant = require('../models/Restaurant/RestaurantModel')
const Location = require('../models/LocationModel')
const OpeningHours = require('../models/Restaurant/OpeningHoursModel')
const RestaurantCuisines = require('../models/Restaurant/RestaurantCuisineModel')
const RestaurantLabels = require('../models/Restaurant/RestaurantLabelModel')
const mongoose = require('mongoose')
const RestaurantCuisineModel = require('../models/Restaurant/RestaurantCuisineModel')
const CusineModel = require('../models/Restaurant/CusineModel')
const SavedRestaurant = require('../models/Saves/SavedRestaurantModel')


class RestaurantRepoImpl {

    async getRecommended(location, filters, userId, cursor, limit = 5) {
       
        const savedCuisineIds = await SavedRestaurant.aggregate([
            { $match: { uid: new mongoose.Types.ObjectId(userId) } },
            {
                $lookup: {
                    from: "restaurantcuisines",
                    localField: "restaurantId",
                    foreignField: "restaurantId",
                    as: "rc"
                }
            },
            { $unwind: "$rc" },
            { $group: { _id: null, cuisineIds: { $addToSet: "$rc.cuisineId" } } }
        ]);

        const cuisineIds = savedCuisineIds[0]?.cuisineIds || [];


        return await Location.aggregate([


            {
                $geoNear: {
                    near: { type: "Point", coordinates: location },
                    distanceField: "distKm",
                    spherical: true,
                    distanceMultiplier: 0.001,
                    maxDistance: filters.distance * 1000
                }
            },
            {
                $lookup: {
                    from: "restaurants",
                    localField: "_id",
                    foreignField: "locationId",
                    as: "restaurant"
                }
            },
            { $unwind: "$restaurant" },
            {
                $lookup: {
                    from: "restaurantcuisines",
                    localField: "restaurant._id",
                    foreignField: "restaurantId",
                    as: "rc"
                }
            },
            { $unwind: "$rc" },
            {
                $match: {
                    "rc.cuisineId": { $in: cuisineIds }
                }
            },
            {
                $lookup: {
                    from: "cuisines",
                    localField: "rc.cuisineId",
                    foreignField: "_id",
                    as: "cuisine"
                }
            },
            { $unwind: "$cuisine" },
            {
                $lookup: {
                    from: "reviews",
                    localField: "restaurant._id",
                    foreignField: "restaurantId",
                    as: "reviews"
                }
            },
            { $unwind: "$reviews" },
            {
                $lookup: {
                    from: "ratings",
                    localField: "reviews._id",
                    foreignField: "reviewId",
                    as: "ratingDocs"
                }
            },
            { $unwind: "$ratingDocs" },
            {
                $lookup: {
                    from: "openinghours",
                    localField: "restaurant._id",
                    foreignField: "restaurantId",
                    as: "oh"
                }
            },
            {
                $lookup: {
                    from: "savedrestaurants",
                    let: { restId: "$restaurant._id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$restaurantId", "$$restId"] },
                                        { $eq: ["$uid", new mongoose.Types.ObjectId(userId)] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: "savedDocs"
                }
            },
            {
                $group: {
                    _id: "$restaurant._id",
                    name: { $first: "$restaurant.name" },
                    distKm: { $first: "$distKm" },
                    avgOverall: { $avg: "$ratingDocs.overall" },
                    cuisines: { $addToSet: "$cuisine.name" },
                    priceCategory: { $first: "$restaurant.priceCategory" },
                    openingHours: { $first: "$oh" },
                    latitude: { $first: "$latitude" },
                    longitude: { $first: "$longitude" },
                    savedDocs: { $first: "$savedDocs" }

                }
            },
            {
                $addFields: {
                    isSaved: { $gt: [{ $size: "$savedDocs" }, 0] }
                }
            },
            {
                $match: {
                    ...(filters.price ? { priceCategory: filters.price } : {}),
                    ...(filters.rating && filters.rating > 0
                        ? { avgOverall: { $gte: filters.rating } }
                        : {})
                }
            },

            cursor ? {
                $match: {
                    $expr: {
                        $or: [
                            { $lt: ["$avgOverall", cursor.avgOverall] },
                            {
                                $and: [
                                    { $eq: ["$avgOverall", cursor.avgOverall] },
                                    { $gte: ["$_id", new mongoose.Types.ObjectId(cursor._id)] }
                                ]
                            }
                        ]
                    }
                }
            } :
            { $match: {} },
            { $sort: { avgOverall: -1, _id: 1 } },
            { $limit: limit + 1 }
        ]).exec();
    }


    async getTopRated(location, filters, userId, cursor, limit = 10) {
  
        return await Location.aggregate([

            {
                $geoNear: {
                    near: { type: "Point", coordinates: location },
                    distanceField: "distKm",
                    spherical: true,
                    distanceMultiplier: 0.001,
                    maxDistance: filters.distance * 1000
                }
            },
            {
                $lookup: {
                    from: "restaurants",
                    localField: "_id",
                    foreignField: "locationId",
                    as: "restaurant"
                }
            },
            { $unwind: "$restaurant" },


            {
                $lookup: {
                    from: "reviews",
                    localField: "restaurant._id",
                    foreignField: "restaurantId",
                    as: "reviews"
                }
            },
            { $unwind: "$reviews" },
            {
                $lookup: {
                    from: "ratings",
                    localField: "reviews._id",
                    foreignField: "reviewId",
                    as: "ratingDocs"
                }
            },
            { $unwind: "$ratingDocs" },
            {
                $lookup: {
                    from: "restaurantcuisines",
                    localField: "restaurant._id",
                    foreignField: "restaurantId",
                    as: "rc"
                }
            },
            { $unwind: "$rc" },
            {
                $lookup: {
                    from: "cuisines",
                    localField: "rc.cuisineId",
                    foreignField: "_id",
                    as: "cuisine"
                }
            },
            { $unwind: "$cuisine" },
            {
                $lookup: {
                    from: "openinghours",
                    localField: "restaurant._id",
                    foreignField: "restaurantId",
                    as: "oh"
                }
            },

            {
                $lookup: {
                    from: "savedrestaurants",
                    let: { restId: "$restaurant._id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$restaurantId", "$$restId"] },
                                        { $eq: ["$uid", new mongoose.Types.ObjectId(userId)] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: "savedDocs"
                }
            },
            {
                $group: {
                    _id: "$restaurant._id",
                    name: { $first: "$restaurant.name" },
                    distKm: { $first: "$distKm" },
                    avgOverall: { $avg: "$ratingDocs.overall" },
                    cuisines: { $addToSet: "$cuisine.name" },
                    priceCategory: { $first: "$restaurant.priceCategory" },
                    openingHours: { $first: "$oh" },
                    latitude: { $first: "$latitude" },
                    longitude: { $first: "$longitude" },
                    savedDocs: { $first: "$savedDocs" }
                }
            },

            {
                $addFields: {
                    isSaved: { $gt: [{ $size: "$savedDocs" }, 0] }
                }
            },

            {
                $match: {
                    ...(filters.cuisine && filters.cuisine !== "All"
                        ? { cuisines: filters.cuisine }
                        : {}),
                    ...(filters.price ? { priceCategory: filters.price } : {}),
                    ...(filters.rating && filters.rating > 0
                        ? { avgOverall: { $gte: filters.rating } }
                        : {})
                }
            },
            cursor ? {
                $match: {
                    $expr: {
                        $or: [
                            { $lt: ["$avgOverall", cursor.avgOverall] },
                            {
                                $and: [
                                    { $eq: ["$avgOverall", cursor.avgOverall] },
                                    { $gte: ["$_id", new mongoose.Types.ObjectId(cursor._id)] }
                                ]
                            }
                        ]
                    }
                }
            } :
                { $match: {} }, { $sort: { avgOverall: -1, _id: 1 } },
            { $limit: limit + 1 }
        ]).exec();
    }





    async getNearby(location, filters, userId, limitCount = 5) {
        return await Location.aggregate([

            // 1) nearby locations
            {
                $geoNear: {
                    near: { type: "Point", coordinates: location },
                    distanceField: "distKm",
                    spherical: true,
                    distanceMultiplier: 0.001,
                    maxDistance: filters.distance * 1000
                }
            },

            // 2) restaurants
            {
                $lookup: {
                    from: "restaurants",
                    localField: "_id",
                    foreignField: "locationId",
                    as: "restaurant"
                }
            },
            { $unwind: "$restaurant" },

            // 3) reviews
            {
                $lookup: {
                    from: "reviews",
                    localField: "restaurant._id",
                    foreignField: "restaurantId",
                    as: "reviews"
                }
            },

            // 4) ratings
            {
                $lookup: {
                    from: "ratings",
                    let: { reviewIds: "$reviews._id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $in: ["$reviewId", "$$reviewIds"]
                                }
                            }
                        }
                    ],
                    as: "ratingDocs"
                }
            },

            // 5) preserve restaurants without ratings
            {
                $unwind: {
                    path: "$ratingDocs",
                    preserveNullAndEmptyArrays: true
                }
            },

            // 6) cuisines
            {
                $lookup: {
                    from: "restaurantcuisines",
                    localField: "restaurant._id",
                    foreignField: "restaurantId",
                    as: "rc"
                }
            },
            {
                $unwind: {
                    path: "$rc",
                    preserveNullAndEmptyArrays: true
                }
            },

            {
                $lookup: {
                    from: "cuisines",
                    localField: "rc.cuisineId",
                    foreignField: "_id",
                    as: "cuisine"
                }
            },
            {
                $unwind: {
                    path: "$cuisine",
                    preserveNullAndEmptyArrays: true
                }
            },

            // 7) opening hours
            {
                $lookup: {
                    from: "openinghours",
                    localField: "restaurant._id",
                    foreignField: "restaurantId",
                    as: "oh"
                }
            },

            // 8) saved restaurants
            {
                $lookup: {
                    from: "savedrestaurants",
                    let: { restId: "$restaurant._id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$restaurantId", "$$restId"] },
                                        { $eq: ["$uid", new mongoose.Types.ObjectId(userId)] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: "savedDocs"
                }
            },

            // 9) group
            {
                $group: {
                    _id: "$restaurant._id",

                    name: { $first: "$restaurant.name" },
                    heroImage: { $first: "$restaurant.heroImage" },
                    distKm: { $first: "$distKm" },

                    avgOverall: {
                        $avg: {
                            $cond: [
                                { $ifNull: ["$ratingDocs.overall", false] },
                                "$ratingDocs.overall",
                                null
                            ]
                        }
                    },

                    cuisines: { $addToSet: "$cuisine.name" },

                    priceCategory: { $first: "$restaurant.priceCategory" },

                    openingHours: { $first: "$oh" },

                    latitude: { $first: "$latitude" },
                    longitude: { $first: "$longitude" },

                    savedDocs: { $first: "$savedDocs" },

                    ratingCount: {
                        $sum: {
                            $cond: [
                                { $ifNull: ["$ratingDocs._id", false] },
                                1,
                                0
                            ]
                        }
                    }
                }
            },

            // 10) normalize
            {
                $addFields: {
                    isSaved: {
                        $gt: [{ $size: "$savedDocs" }, 0]
                    },

                    avgOverall: {
                        $ifNull: ["$avgOverall", null]
                    }
                }
            },

            // 11) filters
            {
                $match: {
                    ...(filters.cuisine && filters.cuisine !== "All"
                        ? { cuisines: filters.cuisine }
                        : {}),

                    ...(filters.price
                        ? { priceCategory: filters.price }
                        : {}),

                    ...(filters.rating && filters.rating > 0
                        ? {
                            $or: [
                                { avgOverall: { $gte: filters.rating } },
                                { avgOverall: null }
                            ]
                        }
                        : {})
                }
            },

            // 12) sort
            {
                $sort: {
                    distKm: 1
                }
            },

            // 13) limit
            {
                $limit: filters.limitCount
                    ? filters.limitCount
                    : limitCount
            }

        ]).exec();
    }




    async getById(id) {
        return await Restaurant.findOne({ _id: id })
    }

    async getLocation(locationId, from) {

        if (from) {
            return await Location.aggregate([
                {
                    $geoNear: {
                        near: { type: "Point", coordinates: from },
                        distanceField: "distKm",
                        spherical: true,
                        distanceMultiplier: 0.001,
                        query: { _id: new mongoose.Types.ObjectId(locationId) },


                    },

                },


            ]).exec()
        }
        return await Location.find({ _id: locationId })

    }

    async getOpeningHours(id) {

        return await OpeningHours.find({ restaurantId: id })

    }

    async getCuisines(restId) {

        if (restId) {
            return await RestaurantCuisines.aggregate([
                { "$match": { "restaurantId": new mongoose.Types.ObjectId(restId) } },
                {
                    "$lookup": {
                        "from": "cuisines",
                        "localField": "cuisineId",
                        "foreignField": "_id",
                        "as": "cuisine"
                    }
                },
                { "$unwind": "$cuisine" },
                { "$project": { "_id": 0, "cuisine._id": 1, "cuisine.name": 1 } }
            ]
            ).exec()
        }
        else {

            return CusineModel.find()
        }

    }

    async getLabels(id) {
        return await RestaurantLabels.aggregate([
            { "$match": { "restaurantId": new mongoose.Types.ObjectId(id) } },
            {
                "$lookup": {
                    "from": "labels",
                    "localField": "labelId",
                    "foreignField": "_id",
                    "as": "label"
                }
            },
            { "$unwind": "$label" },
            { "$project": { "_id": 0, "label._id": 1, "label.name": 1, "label.symbol": 1 } }
        ]
        ).exec()
    }



    async getSimilarRestaurants(id) {

        return await RestaurantCuisines.aggregate([


            { $match: { restaurantId: new mongoose.Types.ObjectId(id) } },
            {
                $group: {
                    _id: null,
                    cuisineIds: { $addToSet: "$cuisineId" }
                }
            },


            {
                $lookup: {
                    from: "restaurantcuisines",
                    let: { cuisineIds: "$cuisineIds" },
                    pipeline: [

                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $in: ["$cuisineId", "$$cuisineIds"] },
                                        { $ne: ["$restaurantId", new mongoose.Types.ObjectId(id)] }
                                    ]
                                }
                            }
                        }

                        ,
                        {
                            $lookup: {
                                from: "reviews",
                                localField: "restaurantId",
                                foreignField: "restaurantId",
                                as: "reviews"
                            }
                        },
                        { $unwind: "$reviews" },
                        {
                            $lookup: {
                                from: "ratings",
                                localField: "reviews._id",
                                foreignField: "reviewId",
                                as: "ratingDocs"
                            }
                        },
                        { $unwind: "$ratingDocs" },
                        {
                            $group: {
                                _id: "$restaurantId",
                                avgOverall: { $avg: "$ratingDocs.overall" }
                            }
                        },
                        {
                            $lookup: {
                                from: "restaurants",
                                localField: "_id",
                                foreignField: "_id",
                                as: "restaurant"
                            }
                        },
                        { $unwind: "$restaurant" },

                        { $sort: { avgOverall: -1 } },
                        { $limit: 3 }
                    ],
                    as: "topSimilarRestaurants"
                }
            },

            {
                $project: {
                    topSimilarRestaurants: 1
                }
            }

        ]).exec()
    }

    async getSavedRestaurants(userId, limit = 5) {
        console.log('Saved')
        return await SavedRestaurant.aggregate([
            {
                $match: {
                    uid: new mongoose.Types.ObjectId(userId)
                }
            },


            {
                $lookup: {
                    from: "restaurants",
                    localField: "restaurantId",
                    foreignField: "_id",
                    as: "restaurant"
                }
            },
            { $unwind: "$restaurant" },


            {
                $lookup: {
                    from: "restaurantcuisines",
                    localField: "restaurant._id",
                    foreignField: "restaurantId",
                    as: "rc"
                }
            },
            {
                $lookup: {
                    from: "cuisines",
                    localField: "rc.cuisineId",
                    foreignField: "_id",
                    as: "cuisines"
                }
            },


            {
                $lookup: {
                    from: "reviews",
                    localField: "restaurant._id",
                    foreignField: "restaurantId",
                    as: "reviews"
                }
            },

            {
                $lookup: {
                    from: "ratings",
                    localField: "reviews._id",
                    foreignField: "reviewId",
                    as: "ratingDocs"
                }
            },


            {
                $addFields: {
                    avgOverall: {
                        $cond: [
                            { $gt: [{ $size: "$ratingDocs" }, 0] },
                            { $avg: "$ratingDocs.overall" },
                            null
                        ]
                    }
                }
            },


            {
                $lookup: {
                    from: "media",
                    let: { restId: "$restaurant._id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$ownerId", "$$restId"] },
                                        { $eq: ["$ownerType", "restaurant"] },
                                        { $eq: ["$type", "image"] }
                                    ]
                                }
                            }
                        },
                        { $sort: { createdAt: 1 } },
                        { $limit: 1 }
                    ],
                    as: "media"
                }
            },

            {
                $unwind: "$media"
            },
            {
                $project: {
                    _id: 0,
                    restaurant: {
                        _id: "$restaurant._id",
                        name: "$restaurant.name",
                        description: "$restaurant.description",
                        priceCategory: "$restaurant.priceCategory"
                    },
                    coverPhoto: 1,
                    cuisines: "$cuisines.name",
                    rating: { overallRating: { $round: ["$avgOverall", 1] } },
                    savedAt: "$createdAt",
                    media: 1
                }
            },

            { $sort: { savedAt: -1 } },
            { $limit: limit }
        ]).exec();
    }


    async getTrending({ userId = null, limit = 6, location = null, maxDistance = 50 }) {


        const pipeline = [];

        // 1) geo
        if (location && maxDistance && Array.isArray(location)) {

            pipeline.push({
                $geoNear: {
                    near: { type: "Point", coordinates: location },
                    distanceField: "distKm",
                    spherical: true,
                    distanceMultiplier: 0.001,
                    maxDistance: maxDistance * 1000
                }
            });

        } else {

            pipeline.push({
                $match: {}
            });
        }

        // 2) restaurants
        pipeline.push(
            {
                $lookup: {
                    from: "restaurants",
                    localField: "_id",
                    foreignField: "locationId",
                    as: "restaurant"
                }
            },

        );
        pipeline.push({
            $unwind: "$restaurant"
        })
        // 3) reviews
        pipeline.push({
            $lookup: {
                from: "reviews",
                localField: "restaurant._id",
                foreignField: "restaurantId",
                as: "reviews"
            }
        });

        // 4) ratings
        pipeline.push({
            $lookup: {
                from: "ratings",
                let: { reviewIds: "$reviews._id" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $in: ["$reviewId", "$$reviewIds"]
                            }
                        }
                    }
                ],
                as: "ratingDocs"
            }
        });

        // 5) preserve restaurants without ratings
        pipeline.push({
            $unwind: {
                path: "$ratingDocs",
                preserveNullAndEmptyArrays: true
            }
        });

        // 6) views
        pipeline.push({
            $lookup: {
                from: "restaurantviews",
                let: { restId: "$restaurant._id" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$restaurantId", "$$restId"]
                            }
                        }
                    },
                    {
                        $group: {
                            _id: "$restaurantId",
                            viewsCount: { $sum: 1 }
                        }
                    }
                ],
                as: "viewsAgg"
            }
        });

        // 7) cuisines
        pipeline.push(
            {
                $lookup: {
                    from: "restaurantcuisines",
                    localField: "restaurant._id",
                    foreignField: "restaurantId",
                    as: "rc"
                }
            },
            {
                $lookup: {
                    from: "cuisines",
                    localField: "rc.cuisineId",
                    foreignField: "_id",
                    as: "cuisines"
                }
            }
        );

        // 8) group
        pipeline.push({
            $group: {
                _id: "$restaurant._id",

                name: { $first: "$restaurant.name" },

                heroImage: { $first: "$restaurant.heroImage" },

                priceCategory: { $first: "$restaurant.priceCategory" },

                distKm: { $first: "$distKm" },

                avgOverall: {
                    $avg: {
                        $cond: [
                            { $ifNull: ["$ratingDocs.overall", false] },
                            "$ratingDocs.overall",
                            null
                        ]
                    }
                },

                cuisines: {
                    $addToSet: {
                        $arrayElemAt: ["$cuisines.name", 0]
                    }
                },

                viewsAgg: { $first: "$viewsAgg" }
            }
        });

        // 9) normalize
        pipeline.push({
            $addFields: {

                viewsCount: {
                    $cond: [
                        { $gt: [{ $size: "$viewsAgg" }, 0] },
                        { $arrayElemAt: ["$viewsAgg.viewsCount", 0] },
                        0
                    ]
                },


                avgOverall: {
                    $ifNull: ["$avgOverall", null]
                }
            }
        });

        // 10) project
        pipeline.push({
            $project: {
                _id: 1,
                name: 1,
                heroImage: 1,
                avgOverall: 1,
                priceCategory: 1,
                cuisines: 1,
                distKm: 1,
                viewsCount: 1
            }
        });

        // 11) sort
        pipeline.push({
            $sort: {
                viewsCount: -1,
                avgOverall: -1
            }
        });

        // 12) limit
        pipeline.push({
            $limit: limit || 6
        });

        const results = await Location.aggregate(pipeline).exec();

        return results.map(r => ({
            _id: r._id.toString(),
            name: r.name,
            avgOverall: r.avgOverall ?? null,
            priceCategory: r.priceCategory,
            cuisines: Array.isArray(r.cuisines)
                ? r.cuisines.filter(Boolean)
                : [],
            distKm: r.distKm ?? null,
            viewsCount: r.viewsCount || 0
        }));
    }



    async getAll(filters = {}, page, limit) {
        const query = {};
        if (filters.flagged) {
            query.flags = { $exists: true, $ne: [] };
        }
        if (filters.search) {
            query.name = { $regex: filters.search, $options: 'i' };
        }
        return await Restaurant.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean();
    }

    async createRestaurant(payload) {
        return await Restaurant.create(payload);
    }

    async updateRestaurant(id, payload) {
        return await Restaurant.findByIdAndUpdate(id, payload, { new: true }).lean();
    }

    async deleteRestaurant(id) {
        return await Restaurant.findByIdAndDelete(id).lean();
    }
}

module.exports = RestaurantRepoImpl