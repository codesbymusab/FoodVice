const express = require("express");
const multer = require("multer");
const reelCntrl = require("../controllers/reelController");
const { validateRequest } = require("../middlewares/validationMiddleware");
const reelSchema = require("../validators/reel.validator");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload",validateRequest(reelSchema),upload.single("file"), reelCntrl.upload)
router.get('/:userId', reelCntrl.getUserReels)
router.get('/reel/:reelId/:userId', reelCntrl.getById)
router.get("/recent/reels", reelCntrl.getRecent);
router.get("/followers/reels", reelCntrl.getFollowers);
router.get('/suggestions/accounts', reelCntrl.suggestAccounts)
router.get('/tags/popular', reelCntrl.getPopularTags)
router.post("/:reelId/view",reelCntrl.updateViews)



module.exports = router;
