import express from 'express'
import ModerationController from '../controllers/moderationController'
import { verifyAuth, requireRole } from '../middlewares/authMiddleware'
import { validateQueryParams, validateRequest } from '../middlewares/validationMiddleware'
import { moderationReportsQuerySchema, moderationReviewQueueQuerySchema } from '../../application/dtos/input/Moderation/ModerationQueryParams'
import { threadQuerySchema } from '../../application/dtos/input/Thread/ThreadQueryParams'
import { assignReportSchema, banUserSchema, flagReviewSchema, moderateReviewSchema, moderateThreadSchema, resolveReportSchema } from '../../application/dtos/input/Moderation/ModerationDTO'

function createModerationRouter(moderationController: ModerationController) {
  
  const router = express.Router()

  router.use(requireRole(['moderator', 'admin']))

  router.get('/reviews',validateQueryParams(moderationReviewQueueQuerySchema),moderationController.getReviewQueue)
  router.post('/reviews/:id/flag',validateRequest(flagReviewSchema),moderationController.flagReview)
  router.post('/reviews/:id/moderate',validateRequest(moderateReviewSchema),moderationController.moderateReview)
  router.get('/threads',validateQueryParams(threadQuerySchema), moderationController.getThreadQueue)
  router.post('/threads/:id/moderate',validateRequest(moderateThreadSchema), moderationController.moderateThread)
  router.get('/reports',validateQueryParams(moderationReportsQuerySchema),moderationController.getReports)
  router.post('/reports/:id/assign',validateRequest(assignReportSchema),moderationController.assignReport)
  router.post('/reports/:id/resolve',validateRequest(resolveReportSchema),moderationController.resolveReport)
  router.post('/users/:id/ban',validateRequest(banUserSchema),moderationController.banUser)
  router.post('/users/:id/unban',moderationController.unbanUser)

  return router
}

export default createModerationRouter