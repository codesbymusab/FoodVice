const authCtr=require('../controllers/authController')
const app=require('express')
const { validateRequest } = require('../middlewares/validationMiddleware')
const registerSchema = require('../validators/register.validator')

const router=app.Router()

router.post('/signup',validateRequest(registerSchema),authCtr.signupUser)
router.post('/login',authCtr.loginUser)
router.post('/google',authCtr.googleSignIn)
router.get('/signout',authCtr.signOut)

module.exports=router

