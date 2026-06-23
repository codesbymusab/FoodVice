const dotenv = require('dotenv')
const express = require('express')
const cors = require('cors')
const mongodbConfig = require('./infrastructure/database/mongodb/config/db')
const authRoute = require('./interfaces/routes/authRoute')
const userRoute = require('./interfaces/routes/userRoute')
const communityRoute = require('./interfaces/routes/communityRoute')
const threadRoute = require('./interfaces/routes/threadRoute')
const restRoute = require('./interfaces/routes/restaurantRoute')
const saveRoute = require('./interfaces/routes/saveRoute')
const likeRoute = require('./interfaces/routes/likeRoute')
const reviewRoute= require('./interfaces/routes/reviewRoute')
const reelRoute= require('./interfaces/routes/reelRoute')
const commentRoute= require('./interfaces/routes/commentRoute')
const topicRoute= require('./interfaces/routes/topicRoute')
const moderationRoute = require('./interfaces/routes/moderationRoute')
const adminRoute = require('./interfaces/routes/adminRoute')
const aiRoute = require('./interfaces/routes/aiRoute')
const { verifyAuth } = require('./interfaces/middlewares/authMiddleware')
const cookieParser = require('cookie-parser');
const { testUploadReels, seedRestaurantImages, seedImages, run, fetchRestaurant, RatedRest, getRec, rReviews } = require('./app')
const { encodeCursor, decodeCursor } = require('./shared/utils/cursorPagination')




dotenv.config()

const app = express()


const allowedOrigins = process.env.ENVIRONMEN === "Development" ? [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://food-vice-d9gy.vercel.app'
] :
[
  'https://food-vice-d9gy.vercel.app'
]

app.use((req, res, next) => {
  console.log('Incoming Origin:', req.headers.origin);
  next();
});

app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    if (allowedOrigins.includes(origin)) return cb(null, true);
    return cb(new Error('CORS not allowed'));
  },
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.listen(3000, () => { console.log('Server Started') })

mongodbConfig.connectDB()


app.use('/auth', authRoute)
app.use('/user', userRoute)
app.use('/community', communityRoute)
app.use('/thread', threadRoute)
app.use('/restaurant', restRoute)
app.use('/save', saveRoute)
app.use('/like', likeRoute)
app.use('/reviews',reviewRoute)
app.use('/reels',reelRoute)
app.use('/comments',commentRoute)
app.use('/topics',topicRoute)
app.use('/moderation', moderationRoute)
app.use('/admin', adminRoute)
app.use('/ai', aiRoute)


