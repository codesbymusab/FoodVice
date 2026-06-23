const express = require('express');
const router = express.Router();
const threadController = require('../controllers/threadController');
const multer = require('multer');
const { validateRequest } = require('../middlewares/validationMiddleware');
const threadSchema = require('../validators/thread.validator');

const upload = multer({ storage: multer.memoryStorage() });

router.post('/',validateRequest(threadSchema),upload.array('media', 10), threadController.createThread);
router.get('/community/all',  threadController.getAllThreads);
router.post('/comment/:commentId/like',  threadController.toggleCommentLike);
router.get('/:id',  threadController.getThreadById);
router.get('/community/:communityId',  threadController.getThreadsByCommunity);
router.post('/:id/like',  threadController.likeThread);
router.post('/:id/dislike',  threadController.dislikeThread);
router.post('/:id/comment',  upload.array('media', 10), threadController.addComment);
router.get('/:id/comments',  threadController.getComments);

module.exports = router;
