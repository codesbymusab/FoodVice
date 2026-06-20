const ReviewRestaurant = require("../../application/use-cases/reviews/ReviewRestaurant")
const MediaRepoImpl = require("../../infrastructure/database/mongodb/repositories/MediaRepoImpl")
const ReviewRepoImpl = require("../../infrastructure/database/mongodb/repositories/ReviewRepoImpl")
const GetRestaurantReviews = require('../../application/use-cases/reviews/GetRestaurantReviews')
const GetRecentReviews = require("../../application/use-cases/reviews/GetRecentReviews")
const GetUserReviews = require("../../application/use-cases/reviews/GetUserReviews")
const StorageServiceImpl = require("../../infrastructure/services/FirebaseStorage/StorageServiceImp")



exports.restReviews = async (req, res) => {
    try {
        const restId = req.params.restaurantId
        const { cursor,limit } = req.query
        const reviewRepo = new ReviewRepoImpl()
        const getReviews = new GetRestaurantReviews(reviewRepo)

        let limitNum=undefined

        if(limit && limit!=='undefined'){
            limitNum=Number.parseInt(limit)
            if(Number.isNaN(limitNum)){
                limitNum=undefined
            }
        }

        const result = await getReviews.execute({ restId,cursor,limit:limitNum })

        if (result) {
            return res.status(200).json(result);
        }

        return res.status(400).json({ message: 'Failed to load reviews' });
    }
    catch (error) {
        console.log(error)
        return res.status(400).json({ message: error.message })
    }
}


exports.recentReviews = async (req, res) => {
    try {
        
        const reviewRepo = new ReviewRepoImpl()
        const getrecentReviews = new GetRecentReviews(reviewRepo)
        const { userId,cursor,limit } = req.query
        
        let limitNum=undefined

        if(limit && limit!=='undefined'){
            limitNum=Number.parseInt(limit)
            if(Number.isNaN(limitNum)){
                limitNum=undefined
            }
        }

        const result = await getrecentReviews.execute({userId,cursor,limit:limitNum})

        if (result) {
            return res.status(200).json(result);
        }

        return res.status(400).json({ message: 'Failed to load recent reviews' });
    }
    catch (error) {
        console.log(error)
        return res.status(400).json({ message: error.message })
    }
}


exports.userReviews = async (req, res) => {
    try {
        
        const userId = req.params.userId
        const {cursor,limit}=req.query
        const reviewRepo = new ReviewRepoImpl()
        const getuserReviews = new GetUserReviews(reviewRepo)

        let limitNum=undefined

        if(limit && limit!=='undefined'){
            limitNum=Number.parseInt(limit)
            if(Number.isNaN(limitNum)){
                limitNum=undefined
            }
        }
        const result = await getuserReviews.execute({userId,cursor,limit:limitNum})

        if (result) {
            return res.status(200).json(result);
        }

        return res.status(400).json({ message: 'Failed to load user reviews' });
    }
    catch (error) {
        console.log(error)
        return res.status(400).json({ message: error.message })
    }
}

exports.createReview= async (req, res) =>  {
  try {
    const { userId, restaurantId, text, rating } = req.body;
    const formattedRating = typeof req.body.rating === "string" ? JSON.parse(req.body.rating) : req.body.rating;

    const files = req.files;
    const reviewRepo = new ReviewRepoImpl();
    const mediaRepo=new MediaRepoImpl()
    const storageService=new StorageServiceImpl()
    const reviewRestaurant = new ReviewRestaurant(reviewRepo,mediaRepo,storageService);
    const result = await reviewRestaurant.execute({
      userId,
      restaurantId,
      text,
      rating:formattedRating,
      files
    });

    return res.status(201).json(result);
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: err.message });
  }
}

