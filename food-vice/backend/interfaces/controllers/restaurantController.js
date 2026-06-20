const RestaurantRepoImpl = require('../../infrastructure/database/mongodb/repositories/RestaurantRepoImpl')
const GetRestaurantDetails = require('../../application/use-cases/restaurants/GetRestaurantDetails')
const MediaRepoImpl = require('../../infrastructure/database/mongodb/repositories/MediaRepoImpl')
const ReviewRepoImpl = require('../../infrastructure/database/mongodb/repositories/ReviewRepoImpl')
const GetSimilarRestaurants = require('../../application/use-cases/restaurants/GetSimilarRest')
const GetTopRatedyRestaurants = require('../../application/use-cases/restaurants/GetTopRatedRest')
const GetRecommendedRestaurants = require('../../application/use-cases/restaurants/GetRecommendedRest')
const GetCuisines = require('../../application/use-cases/restaurants/GetCuisines')
const GetRestaurantPhotos = require('../../application/use-cases/restaurants/GetRestaurantPhotos')
const SaveRepoImpl = require('../../infrastructure/database/mongodb/repositories/SaveRepoImpl')
const GetSavedRestaurants = require('../../application/use-cases/saves/GetSavedRestaurants')
const GetNearbyyRestaurants = require('../../application/use-cases/restaurants/GetNearbyRest')
const RestaurantViewModel = require('../../infrastructure/database/mongodb/models/Restaurant/RestaurantViewModel')
const GetTrendingRestaurants = require('../../application/use-cases/restaurants/GetTrendingRestaurants')
const mongoose = require('mongoose')

exports.recommendedRest = async (req, res) => {

    try {

        let location = undefined

        const { lat, lon, cuisine, price, rating, dist, userId, cursor, limit } = req.query;

        const filters = {
            cuisine: cuisine || "All",
            price: price || "",
            rating: rating ? Number(rating) : 0,
            distance: dist ? Number(dist) : 50,
        };


        if (lat && lon && lat !== 'undefined' && lon !== 'undefined') {
            const latNum = parseFloat(lat);
            const lonNum = parseFloat(lon);

            if (Number.isNaN(latNum) || Number.isNaN(lonNum)) {
                location = undefined
            }
            else {
                location = [lonNum, latNum]
            }
        }

        let limitNum=undefined

        if(limit && limit!=='undefined'){
            limitNum=Number.parseInt(limit)
            if(Number.isNaN(limitNum)){
                limitNum=undefined
            }
        }

        const restRepo = new RestaurantRepoImpl()
        const mediaRepo = new MediaRepoImpl()

        const getRecRest = new GetRecommendedRestaurants(restRepo, mediaRepo)
        const result = await getRecRest.execute({ location,filters, userId, cursor, limit:limitNum})

        if (result) {
            return res.status(200).json({ success:true, message:'Recommended Restaurants', ...result });
        }

        return res.status(400).json({success: false, message: 'Failed to load Restaurants' });


    }
    catch (error) {
        console.log(error)
        return res.status(400).json({success:false, message: error.message })
    }

}

exports.topRatedRest = async (req, res) => {

    try {

        let location = undefined

        const { lat, lon, cuisine, price, rating, dist, userId, cursor, limit } = req.query;

        const filters = {
            cuisine: cuisine || "All",
            price: price || "",
            rating: rating ? Number(rating) : 0,
            distance: dist ? Number(dist) : 50,

        };


        if (lat && lon && lat !== 'undefined' && lon !== 'undefined') {
            const latNum = parseFloat(lat);
            const lonNum = parseFloat(lon);

            if (Number.isNaN(latNum) || Number.isNaN(lonNum)) {
                location = undefined
            }
            else {
                location = [lonNum, latNum]
            }
        }

        let limitNum = undefined

        if (limit && limit != 'undefined') {
            limitNum = Number.parseInt(limit)
            if (Number.isNaN(limitNum)) {
                limitNum = undefined
            }
        }
        const restRepo = new RestaurantRepoImpl()
        const mediaRepo = new MediaRepoImpl()

        const getTopRest = new GetTopRatedyRestaurants(restRepo, mediaRepo)
        const result = await getTopRest.execute({ location,filters,userId, cursor, limit:limitNum})

        if (result) {
            return res.status(200).json({ success:true, message:'Top Rated Restaurants', ...result });
        }

        return res.status(400).json({ succes:false, message: 'Failed to load Restaurants' });


    }
    catch (error) {
        console.log(error)
        return res.status(400).json({ success:false, message: error.message })
    }

}


exports.nearbyRest = async (req, res) => {

    try {

        let location = undefined

        const { lat, lon, cuisine, price, rating, dist, userId, limitCount } = req.query;

        const filters = {
            cuisine: cuisine || "All",
            price: price || "",
            rating: rating ? Number(rating) : 0,
            distance: dist ? Number(dist) : 50,
            limitCount: limitCount ? Number(limitCount) : 5
        };


        if (lat && lon && lat !== 'undefined' && lon !== 'undefined') {
            const latNum = parseFloat(lat);
            const lonNum = parseFloat(lon);

            if (Number.isNaN(latNum) || Number.isNaN(lonNum)) {
                location = undefined
            }
            else {
                location = [lonNum, latNum]
            }
        }

        const restRepo = new RestaurantRepoImpl()
        const mediaRepo = new MediaRepoImpl()

        const getNearRest = new GetNearbyyRestaurants(restRepo, mediaRepo)
        const result = await getNearRest.execute({ location: location, filters: filters, userId: userId })

        if (result) {
            return res.status(200).json({ details: result });
        }

        return res.status(400).json({ message: 'Failed to load Restaurants' });


    }
    catch (error) {
        console.log(error)
        return res.status(400).json({ message: error.message })
    }

}


exports.restDetails = async (req, res) => {



    try {

        const restId = req.params.id

        let location = undefined

        const { lat, lon, userId } = req.query

        if (lat && lon && lat !== 'undefined' && lon !== 'undefined') {
            const latNum = parseFloat(lat);
            const lonNum = parseFloat(lon);

            if (Number.isNaN(latNum) || Number.isNaN(lonNum)) {
                location = undefined
            }
            else {
                location = [lonNum, latNum]
            }
        }

        const restRepo = new RestaurantRepoImpl()
        const mediaRepo = new MediaRepoImpl()
        const reviewRepo = new ReviewRepoImpl()
        const saveRepo = new SaveRepoImpl()
        const getRestDetails = new GetRestaurantDetails(restRepo, mediaRepo, reviewRepo, saveRepo)
        const restDetails = await getRestDetails.execute({ id: restId, location: location, userId: userId })

        if (restDetails) {
            return res.status(200).json({ details: restDetails });
        }

        return res.status(400).json({ message: 'Restaurant not found' });


    }
    catch (error) {
        console.log(error)
        return res.status(400).json({ message: error.message })
    }


}

exports.similarRest = async (req, res) => {


    try {

        const restId = req.params.id

        let location = undefined

        const { lat, lon } = req.query

        if (lat && lon && lat !== 'undefined' && lon !== 'undefined') {
            const latNum = parseFloat(lat);
            const lonNum = parseFloat(lon);

            if (Number.isNaN(latNum) || Number.isNaN(lonNum)) {
                location = undefined
            }
            else {
                location = [lonNum, latNum]
            }
        }


        const restRepo = new RestaurantRepoImpl()
        const mediaRepo = new MediaRepoImpl()

        const getSimRest = new GetSimilarRestaurants(restRepo, mediaRepo)
        const result = await getSimRest.execute({ id: restId, location: location })

        if (result) {
            return res.status(200).json({ details: result });
        }

        return res.status(400).json({ message: 'Restaurant not found' });


    }
    catch (error) {
        console.log(error)
        return res.status(400).json({ message: error.message })
    }




}

exports.restCuisines = async (req, res) => {
    try {

        const restRepo = new RestaurantRepoImpl()
        const getCus = new GetCuisines(restRepo)
        const result = await getCus.execute()

        if (result) {
            return res.status(200).json({ result });
        }

        return res.status(400).json({ message: 'Failed to load cuisines' });
    }
    catch (error) {
        console.log(error)
        return res.status(400).json({ message: error.message })
    }
}



exports.restPhotos = async (req, res) => {
    try {
        const restId = req.params.id
        console.log(restId)
        const mediaRepo = new MediaRepoImpl()
        const getPhotos = new GetRestaurantPhotos(mediaRepo)
        const photos = await getPhotos.execute({ restId: restId })

        if (photos) {
            return res.status(200).json({ photos });
        }

        return res.status(400).json({ message: 'Failed to load reviews' });
    }
    catch (error) {
        console.log(error)
        return res.status(400).json({ message: error.message })
    }
}



exports.savedRestaurants = async (req, res) => {
    try {
        const { userId } = req.query;
        const restRepo = new RestaurantRepoImpl()
        const getSavedRestaurants = new GetSavedRestaurants(restRepo);

        const result = await getSavedRestaurants.execute({ userId: userId });
        res.json(result);
    } catch (err) {
        console.error(err);
        return res.status(400).json({ error: err.message });
    }
}



exports.trendingRestaurants = async (req, res) => {
    try {
        const { lat, lon, maxDistance, limit } = req.query;
        let location = null;
        if (lat && lon) {
            const latNum = parseFloat(lat);
            const lonNum = parseFloat(lon);
            if (!Number.isNaN(latNum) && !Number.isNaN(lonNum)) location = [lonNum, latNum];
        }
        const restRepo = new RestaurantRepoImpl()
        const mediaRepo = new MediaRepoImpl()
        const getTrending = new GetTrendingRestaurants(restRepo, mediaRepo)
        const data = await getTrending.execute({
            userId: req.query.userId || null,
            limit: limit ? Number(limit) : 5,
            location,
            maxDistance: maxDistance ? Number(maxDistance) : 50
        });

        return res.status(200).json({ details: data });
    } catch (err) {
        console.error("trending error:", err);
        return res.status(500).json({ message: err.message });
    }
};


exports.postView = async (req, res) => {
    try {
        const restaurantId = req.params.id;
        const { userId, meta } = req.body;

        if (!restaurantId) return res.status(400).json({ message: "restaurant id required" });
        if (!userId) return res.status(400).json({ message: "userId required" });

        const view = new RestaurantViewModel({
            restaurantId: new mongoose.Types.ObjectId(restaurantId),
            uid: new mongoose.Types.ObjectId(userId),
            meta: meta || {}
        });

        await view.save();
        return res.status(201).json({ message: "view recorded" });
    } catch (err) {
        console.error("postView error:", err);
        return res.status(500).json({ message: err.message });
    }
};
