import { Request, Response } from 'express'

import FlagReview from '../../application/use-cases/moderation/FlagReview'
import ModerateReview from '../../application/use-cases/moderation/ModerateReview'

import ModerateThread from '../../application/use-cases/moderation/ModerateThread'

import AssignReport from '../../application/use-cases/moderation/AssignReport'
import ResolveReport from '../../application/use-cases/moderation/ResolveReport'
import BanUser from '../../application/use-cases/moderation/BanUser'
import UnbanUser from '../../application/use-cases/moderation/UnbanUser'
import ReviewRepoImpl from '../../infrastructure/database/mongodb/repositories/ReviewRepoImpl'
import ThreadRepoImpl from '../../infrastructure/database/mongodb/repositories/ThreadRepoImpl'
import ReportRepoImpl from '../../infrastructure/database/mongodb/repositories/ReportRepoImpl'
import UserRepoImpl from '../../infrastructure/database/mongodb/repositories/UserRepoImpl'

import { AssignReportDTO, BanUserDTO, FlagReviewDTO, ModerateReviewDTO, ModerateThreadDTO, ResolveReportDTO } from '../../application/dtos/input/Moderation/ModerationDTO'
import { ThreadQueryParams } from '../../application/dtos/input/Thread/ThreadQueryParams'
import { ModerationReportsQueryParams, ModerationReviewQueueQueryParams, ModerationThreadQueueQueryParams } from '../../application/dtos/input/Moderation/ModerationQueryParams'
import AuditService from '../../infrastructure/services/Audit/AuditServiceImpl'

export default class ModerationController {
  constructor(
    private reviewRepo: ReviewRepoImpl,
    private threadRepo: ThreadRepoImpl,
    private reportRepo: ReportRepoImpl,
    private userRepo: UserRepoImpl,
    private auditService: AuditService
  ) {
    this.getReviewQueue = this.getReviewQueue.bind(this)
    this.flagReview = this.flagReview.bind(this)
    this.moderateReview = this.moderateReview.bind(this)
    this.getThreadQueue = this.getThreadQueue.bind(this)
    this.moderateThread = this.moderateThread.bind(this)
    this.getReports = this.getReports.bind(this)
    this.assignReport = this.assignReport.bind(this)
    this.resolveReport = this.resolveReport.bind(this)
    this.banUser = this.banUser.bind(this)
    this.unbanUser = this.unbanUser.bind(this)
  }

  async getReviewQueue(req: Request, res: Response) {
    // try {
    //   const { page, limit, status, search } = req.validatedQuery as ModerationReviewQueueQueryParams

    //   const reviewQue=GetReviewQ
    //   const reviews = await this.getReviewQueue.execute({ page, limit, status, search })

    //   return res.status(200).json({ success: true, data: reviews })
    // } catch (error) {
    //   console.error(error)
    //   return res.status(400).json({ success: false, error: error instanceof Error ? error.message : 'Failed to load review queue' })
    // }
  }



  async getThreadQueue(req: Request, res: Response) {
    // try {
    //   const { page, limit, status, search } = req.validatedQuery as ModerationThreadQueueQueryParams

    //   const getThreadQueue = new GetThreadQueue(this.threadRepo)
    //   const threads = await getThreadQueue.execute({ page, limit, status, search })
    //   return res.status(200).json({ success: true, data: threads })
    // } catch (error) {
    //   console.error(error)
    //   return res.status(400).json({ success: false, error: error instanceof Error ? error.message : 'Failed to load thread queue' })
    // }
  }

  
  async getReports(req: Request, res: Response) {
    // try {
    //   const { page, limit, status, assignedTo } = req.validatedQuery as ModerationReportsQueryParams

    //   const getReports = new GetReports(this.reportRepo)
    //   const reports = await getReports.execute({ status, assignedTo, page, limit })
    //   return res.status(200).json({ success: true, data: reports })
    // } catch (error) {
    //   console.error(error)
    //   return res.status(400).json({ success: false, error: error instanceof Error ? error.message : 'Failed to load reports' })
    // }
  }

  async flagReview(req: Request, res: Response) {
    try {
      const reviewId = req.params.id as string
      const { reason } = req.validatedBody as FlagReviewDTO

      const flagReview = new FlagReview(this.reviewRepo, this.auditService)
      const review = await flagReview.execute({ reason },{ reviewId, userId: req.userId as string, userRole: req.userRole as string})

      return res.status(200).json({ success: true, data: review })
    } catch (error) {
      console.error(error)
      return res.status(400).json({ success: false, error: error instanceof Error ? error.message : 'Failed to flag review' })
    }
  }

  async moderateReview(req: Request, res: Response) {
    try {
      const reviewId = req.params.id as string
      const { action, note } = req.validatedBody as ModerateReviewDTO
      const moderateReview = new ModerateReview(this.reviewRepo, this.auditService)
      const review = await moderateReview.execute({action, note },{ reviewId, userId: req.userId as string, userRole: req.userRole as string})

      return res.status(200).json({ success: true, data: review })
    } catch (error) {
      console.error(error)
      return res.status(400).json({ success: false, error: error instanceof Error ? error.message : 'Failed to moderate review' })
    }
  }

  async moderateThread(req: Request, res: Response) {
    try {
      const threadId = req.params.id as string
      const { action, note } = req.validatedBody as ModerateThreadDTO
      const moderateThread = new ModerateThread(this.threadRepo, this.auditService)
      const thread = await moderateThread.execute({ action, note },{ threadId, userId: req.userId as string, userRole: req.userRole as string})

      return res.status(200).json({ success: true, data: thread })
    } catch (error) {
      console.error(error)
      return res.status(400).json({ success: false, error: error instanceof Error ? error.message : 'Failed to moderate thread' })
    }
  }


  async assignReport(req: Request, res: Response) {
    try {
      const reportId = req.params.id as string
      const { assignedTo } = req.validatedBody as AssignReportDTO
      const assignReport = new AssignReport(this.reportRepo, this.auditService)
      const report = await assignReport.execute({ assignedTo},{reportId, userId: req.userId as string, userRole: req.userRole as string })

      return res.status(200).json({ success: true, data: report })
    } catch (error) {
      console.error(error)
      return res.status(400).json({ success: false, error: error instanceof Error ? error.message : 'Failed to assign report' })
    }
  }

  async resolveReport(req: Request, res: Response) {
    try {
      const reportId = req.params.id as string
      const { resolution, escalateToAdmin } = req.validatedBody as ResolveReportDTO
      const resolveReport = new ResolveReport(this.reportRepo, this.auditService)
      const report = await resolveReport.execute({ resolution, escalateToAdmin},{reportId,userId: req.userId as string, userRole: req.userRole as string })
      return res.status(200).json({ success: true, data: report })
    } catch (error) {
      console.error(error)
      return res.status(400).json({ success: false, error: error instanceof Error ? error.message : 'Failed to resolve report' })
    }
  }

  async banUser(req: Request, res: Response) {
    try {
      const targetId = req.params.id as string
      const { reason, until } = req.validatedBody as BanUserDTO
      const banUser = new BanUser(this.userRepo, this.auditService)
      const user = await banUser.execute({ reason, until},{targetId,userId: req.userId as string, userRole: req.userRole as string })

      return res.status(200).json({ success: true, data: user })
    } catch (error) {
      console.error(error)
      return res.status(400).json({ success: false, error: error instanceof Error ? error.message : 'Failed to ban user' })
    }
  }

  async unbanUser(req: Request, res: Response) {
    try {
      const targetId = req.params.id as string
      const unbanUser = new UnbanUser(this.userRepo, this.auditService)
      const user = await unbanUser.execute({ targetId, userId: req.userId as string, userRole: req.userRole as string })

      return res.status(200).json({ success: true, data: user })
    } catch (error) {
      console.error(error)
      return res.status(400).json({ success: false, error: error instanceof Error ? error.message : 'Failed to unban user' })
    }
  }
}
