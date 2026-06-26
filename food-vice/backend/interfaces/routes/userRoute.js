const express=require('express')
const userCtrl=require('../controllers/userController')
const { verifyAuth } = require('../middlewares/authMiddleware')
const router=express.Router()
const multer=require('multer')
const { validateRequest } = require('../middlewares/validationMiddleware')
const profileSchema = require('../validators/profile.validator')

const upload = multer({storage: multer.memoryStorage()})

router.put('/edit',validateRequest(profileSchema),upload.single("profilePhoto"),userCtrl.editUser)
router.get('/me',userCtrl.getUser)
router.get('/profile/:userId',userCtrl.getUserProfile)
router.post("/follow", userCtrl.toggleFollow);

module.exports=router