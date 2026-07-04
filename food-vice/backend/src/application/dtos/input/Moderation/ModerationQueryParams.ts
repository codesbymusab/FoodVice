import { z } from 'zod'
import { ReviewStatus } from '../../../../shared/utils/moderationConstants'

export const moderationReviewQueueQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
  status: z.enum([ReviewStatus.PENDING, ReviewStatus.APPROVED, ReviewStatus.REJECTED, ReviewStatus.HIDDEN]).default(ReviewStatus.PENDING),
  search: z.string().trim().optional().default('')
})

export type ModerationReviewQueueQueryParams = z.infer<typeof moderationReviewQueueQuerySchema>

export const moderationThreadQueueQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
  status: z.enum([ReviewStatus.PENDING, ReviewStatus.APPROVED, ReviewStatus.REJECTED, ReviewStatus.HIDDEN]).default(ReviewStatus.PENDING),
  search: z.string().trim().optional().default('')
})

export type ModerationThreadQueueQueryParams = z.infer<typeof moderationThreadQueueQuerySchema>

export const moderationReportsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
  status: z.string().trim().optional(),
  assignedTo: z.string().trim().optional()
})

export type ModerationReportsQueryParams = z.infer<typeof moderationReportsQuerySchema>
