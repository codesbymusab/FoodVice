const dotenv = require('dotenv')
const mongodbConfig = require('./infrastructure/database/mongodb/config/db')

import express,{Request,Response,NextFunction} from 'express'
import cors from 'cors'
import UploadReel from './application/use-cases/reels/UploadReel'
import MediaRepoImpl from './infrastructure/database/mongodb/repositories/MediaRepoImpl'
import ReelRepoImpl from './infrastructure/database/mongodb/repositories/ReelRepoImpl'
import StorageServiceImpl from './infrastructure/services/FirebaseStorage/StorageServiceImp'
import GetRecentReels from './application/use-cases/reels/GetRecentReels'
import GetFollowerReels from './application/use-cases/reels/GetFollowerReels'
import GetPopularTags from './application/use-cases/reels/GetPopularTags'
import GetReel from './application/use-cases/reels/GetReel'
import GetUserReels from './application/use-cases/reels/GetUserReels'
import SuggestAccounts from './application/use-cases/reels/SuggestAccounts'
import createReelRouter from './interfaces/routes/reelRoute'
import ReelController from './interfaces/controllers/reelController'
import GetRecentReviews from './application/use-cases/reviews/GetRecentReviews'
import GetRestaurantReviews from './application/use-cases/reviews/GetRestaurantReviews'
import GetUserReviews from './application/use-cases/reviews/GetUserReviews'
import ReviewRestaurant from './application/use-cases/reviews/ReviewRestaurant'
import ReviewRepoImpl from './infrastructure/database/mongodb/repositories/ReviewRepoImpl'
import ReviewController from './interfaces/controllers/reviewController'
import createReviewRouter from './interfaces/routes/reviewRoute'
import AuthController from './interfaces/controllers/authController'
import UserController from './interfaces/controllers/userController'
import CommunityController from './interfaces/controllers/communityController'
import ThreadController from './interfaces/controllers/threadController'
import CommentController from './interfaces/controllers/commentController'
import SaveController from './interfaces/controllers/saveController'
import TopicController from './interfaces/controllers/topicController'
import ModerationController from './interfaces/controllers/moderationController'
import AdminController from './interfaces/controllers/adminController'
import AIController from './interfaces/controllers/aiController'
import UserRepoImpl from './infrastructure/database/mongodb/repositories/UserRepoImpl'
import CommunityRepoImpl from './infrastructure/database/mongodb/repositories/CommunityRepoImpl'
import ThreadRepoImpl from './infrastructure/database/mongodb/repositories/ThreadRepoImpl'
import RestaurantRepoImpl from './infrastructure/database/mongodb/repositories/RestaurantRepoImpl'
import TopicRepoImpl from './infrastructure/database/mongodb/repositories/TopicRepoImpl'
import SaveRepoImpl from './infrastructure/database/mongodb/repositories/SaveRepoImpl'
import CommentRepoImpl from './infrastructure/database/mongodb/repositories/CommentRepoImpl'
import ReportRepoImpl from './infrastructure/database/mongodb/repositories/ReportRepoImpl'
import AuditLogRepoImpl from './infrastructure/database/mongodb/repositories/AuditLogRepoImpl'
import AuthServiceImpl from './infrastructure/services/JWT/AuthServiceImp'
import OAuthServiceImpl from './infrastructure/services/OAuth/AuthServicesImp'
import GroqService from './infrastructure/services/GroqAI/AIServiceImpl'
import AuditService from './infrastructure/services/AuditService'
import GetUser from './application/use-cases/user/GetUser'
import GetUserProfile from './application/use-cases/user/GetUserProfile'
import EditUserProfile from './application/use-cases/user/EditUserProfile'
import FollowUser from './application/use-cases/user/FollowUser'
import CreateCommunity from './application/use-cases/community/CreateCommunity'
import GetCommunities from './application/use-cases/community/GetCommunities'
import JoinCommunity from './application/use-cases/community/JoinCommunity'
import GetJoinedCommunities from './application/use-cases/community/GetJoinedCommunities'
import GetRecommendedCommunities from './application/use-cases/community/GetRecommendedCommunities'
import SaveRestaurant from './application/use-cases/saves/SaveRestaurant'
import SaveReel from './application/use-cases/saves/SaveReel'
import GetReelComments from './application/use-cases/reels/GetReelComments'
import PostReelComment from './application/use-cases/reels/PostReelComment'
import SignupUser from './application/use-cases/user/SignupUser'
import LoginUser from './application/use-cases/user/LoginUser'
import GoogleSignIn from './application/use-cases/user/GoogleSignIn'
import createAuthRouter from './interfaces/routes/authRoute'
import createUserRouter from './interfaces/routes/userRoute'
import createCommunityRouter from './interfaces/routes/communityRoute'
import createThreadRouter from './interfaces/routes/threadRoute'
import createSaveRouter from './interfaces/routes/saveRoute'
import createCommentRouter from './interfaces/routes/commentRoute'
import createTopicRouter from './interfaces/routes/topicRoute'
import createModerationRouter from './interfaces/routes/moderationRoute'
import createAdminRouter from './interfaces/routes/adminRoute'
import createAIRouter from './interfaces/routes/aiRoute'
import { verifyAuth } from './interfaces/middlewares/authMiddleware'
import RestaurantController from './interfaces/controllers/restaurantController'
import GetCusines from './application/use-cases/restaurants/GetCuisines'
import GetNearbyyRestaurants from './application/use-cases/restaurants/GetNearbyRest'
import GetRecommendedRestaurants from './application/use-cases/restaurants/GetRecommendedRest'
import GetRestaurantDetails from './application/use-cases/restaurants/GetRestaurantDetails'
import GetRestaurantPhotos from './application/use-cases/restaurants/GetRestaurantPhotos'
import GetSimilarRestaurants from './application/use-cases/restaurants/GetSimilarRest'
import GetTopRatedyRestaurants from './application/use-cases/restaurants/GetTopRatedRest'
import GetTrendingRestaurants from './application/use-cases/restaurants/GetTrendingRestaurants'
import GetSavedRestaurants from './application/use-cases/saves/GetSavedRestaurants'
import createRestaurantRouter from './interfaces/routes/restaurantRoute'
import LikeController from './interfaces/controllers/likeController'
import createLikeRouter from './interfaces/routes/likeRoute'
import LikeReel from './application/use-cases/reels/LikeReel'
import LikeReelComment from './application/use-cases/reels/LikeReelComment'
import LikeReview from './application/use-cases/reviews/LikeReview'
import LikeRepoImpl from './infrastructure/database/mongodb/repositories/LikeRepoImpl'
const cookieParser=  require('cookie-parser')


// Repositories

const mediaRepo = new MediaRepoImpl()

// Services

const storageService = new StorageServiceImpl()
const groqService= new GroqService()
const auditService=new AuditService()

// Auth

const userRepo = new UserRepoImpl()
const authService = new AuthServiceImpl()
const oAuthService = new OAuthServiceImpl()
const signupUser = new SignupUser(userRepo)
const loginUser = new LoginUser(userRepo, authService)
const googleSignIn = new GoogleSignIn(userRepo, oAuthService, authService)
const authController = new AuthController(signupUser, loginUser, googleSignIn)

// User

const getUser = new GetUser(userRepo)
const getUserProfile = new GetUserProfile(userRepo)
const editUser = new EditUserProfile(userRepo, storageService)
const followUser = new FollowUser(userRepo)
const userController = new UserController(getUser, getUserProfile, editUser, followUser)


// Reel

const reelRepo = new ReelRepoImpl()
const getRecentReels = new GetRecentReels(reelRepo)
const getFollowerReels = new GetFollowerReels(reelRepo)
const getPopularTags = new GetPopularTags(reelRepo)
const getUserReels = new GetUserReels(reelRepo)
const getReel = new GetReel(reelRepo)
const suggestAcc = new SuggestAccounts(reelRepo)
const uploadReel = new UploadReel(mediaRepo, reelRepo, storageService)

const reelController=new ReelController(uploadReel, getRecentReels, getFollowerReels, getPopularTags, getUserReels, getReel, suggestAcc)


// Reviews

const reviewRepo = new ReviewRepoImpl()
const getReviews = new GetRestaurantReviews(reviewRepo)
const getrecentReviews = new GetRecentReviews(reviewRepo)
const getUserReviews = new GetUserReviews(reviewRepo)
const reviewRestaurant = new ReviewRestaurant(reviewRepo, mediaRepo, storageService)
const reviewController=new ReviewController(
  getReviews,
  getrecentReviews, 
  getUserReviews, 
  reviewRestaurant
)

// Save

const saveRepo = new SaveRepoImpl()
const saveRestaurant = new SaveRestaurant(saveRepo)
const saveReel = new SaveReel(saveRepo)
const saveController = new SaveController(saveRestaurant, saveReel)

// Restaurant

const restRepo=new RestaurantRepoImpl()

const getRecomRest= new GetRecommendedRestaurants(restRepo,mediaRepo)
const getTopRest=new GetTopRatedyRestaurants(restRepo,mediaRepo)
const getNearRest=new GetNearbyyRestaurants(restRepo,mediaRepo)
const getRestDetails=new GetRestaurantDetails(restRepo,mediaRepo,reviewRepo,saveRepo)
const getSimRest=new GetSimilarRestaurants(restRepo,mediaRepo)
const getCuis = new GetCusines(restRepo)
const getPhotos=new GetRestaurantPhotos(mediaRepo)
const getSavedRest=new GetSavedRestaurants(restRepo)
const getTrendRest=new GetTrendingRestaurants(restRepo,mediaRepo)

const restaurantController=new RestaurantController(
  getRecomRest, 
  getTopRest, 
  getNearRest,
   getRestDetails, 
   getSimRest, 
   getCuis, 
   getPhotos, 
   getSavedRest, 
   getTrendRest,

)

// Community

const communityRepo = new CommunityRepoImpl()
const createCommunity = new CreateCommunity(communityRepo, storageService)
const getCommunities = new GetCommunities(communityRepo)
const getRecommendedCommunities = new GetRecommendedCommunities(communityRepo)
const joinCommunity = new JoinCommunity(communityRepo)
const getJoinedCommunities = new GetJoinedCommunities(communityRepo)
const communityController = new CommunityController(
  createCommunity,
  getCommunities,
  getRecommendedCommunities,
  joinCommunity,
  getJoinedCommunities,
  communityRepo
)

// Thread

const threadRepo = new ThreadRepoImpl()
const threadController = new ThreadController(threadRepo, mediaRepo, storageService)

// Comment

const commentRepo = new CommentRepoImpl()
const getReelComments = new GetReelComments(commentRepo)
const postReelComment = new PostReelComment(commentRepo)
const commentController = new CommentController(getReelComments, postReelComment)



// Like

const likeRepo=new LikeRepoImpl()
const likeRev= new LikeReview(likeRepo)
const likeReel=new LikeReel(likeRepo)
const likeReelComment=new LikeReelComment(likeRepo)
const likeController=new LikeController(likeRev,likeReel,likeReelComment)
const likeRouter=createLikeRouter(likeController)

// Topic

const topicRepo = new TopicRepoImpl()
const topicController = new TopicController(topicRepo)

// Moderation

const reportRepo = new ReportRepoImpl()
const auditLogRepo = new AuditLogRepoImpl()
const moderationController = new ModerationController(
  reviewRepo,
  threadRepo,
  reportRepo,
  userRepo,
  auditService
)

// Admin

const adminController = new AdminController(
  new RestaurantRepoImpl(),
  userRepo,
  auditService,
  auditLogRepo
)

// AI

const aiController = new AIController(
  new RestaurantRepoImpl(),
  reviewRepo,
  groqService
)

// Routers

const restaurantRouter=createRestaurantRouter(restaurantController)
const reelRouter = createReelRouter(reelController)
const reviewRouter = createReviewRouter(reviewController)
const authRouter = createAuthRouter(authController)
const userRouter = createUserRouter(userController)
const communityRouter = createCommunityRouter(communityController)
const threadRouter = createThreadRouter(threadController)
const saveRouter = createSaveRouter(saveController)
const commentRouter = createCommentRouter(commentController)
const topicRouter = createTopicRouter(topicController)
const moderationRouter = createModerationRouter(moderationController)
const adminRouter = createAdminRouter(adminController)
const aiRouter = createAIRouter(aiController)

dotenv.config()

const app = express()


const allowedOrigins = process.env.ENVIRONMENT === "Development" ? [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://food-vice-d9gy.vercel.app'
] :
[
  'https://food-vice-d9gy.vercel.app'
]

app.use((req:Request, res:Response, next:NextFunction) => {
  console.log('Incoming Origin:', req.headers.origin);
  next();
});

const  corsOptions = {
  origin: (origin: string | undefined, cb: (err: Error | null, allow?: boolean) => void) => {
    if (!origin) return cb(null, true);
    if (allowedOrigins.includes(origin)) return cb(null, true);
    return cb(new Error("CORS not allowed"));
  },
  credentials: true
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

app.listen(3000, () => { console.log('Server Started') })

mongodbConfig.connectDB()


 

app.use('/auth', authRouter)

app.use(verifyAuth)

app.use('/user', userRouter)
app.use('/restaurant', restaurantRouter)
app.use('/community', communityRouter)
app.use('/thread', threadRouter)
app.use('/save', saveRouter)
app.use('/like', likeRouter)
app.use('/reviews', reviewRouter)
app.use('/reels', reelRouter)
app.use('/comments', commentRouter)
app.use('/topics', topicRouter)
app.use('/moderation', moderationRouter)
app.use('/admin', adminRouter)
app.use('/ai', aiRouter)


