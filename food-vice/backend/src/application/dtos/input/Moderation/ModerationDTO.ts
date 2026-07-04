import { z } from 'zod'

export const flagReviewSchema = z.object({
  reason: z.string({ message: 'Reason is required' }).trim().min(1, 'Reason is required')
})

export type FlagReviewDTO = z.infer<typeof flagReviewSchema>

export const moderateReviewSchema = z.object({
  action: z.enum(['approve', 'reject', 'hide'], { message: 'Invalid moderation action' }),
  note: z.string().trim().optional()
})

export type ModerateReviewDTO = z.infer<typeof moderateReviewSchema>

export const moderateThreadSchema = z.object({
  action: z.enum(['approve', 'reject', 'hide'], { message: 'Invalid moderation action' }),
  note: z.string().trim().optional()
})

export type ModerateThreadDTO = z.infer<typeof moderateThreadSchema>

export const assignReportSchema = z.object({
  assignedTo: z.string({ message: 'assignedTo is required' }).trim().min(1, 'assignedTo is required')
})

export type AssignReportDTO = z.infer<typeof assignReportSchema>

export const resolveReportSchema = z.object({
  resolution: z.string({ message: 'Resolution is required' }).trim().min(1, 'Resolution is required'),
  escalateToAdmin: z.coerce.boolean().default(false)
})

export type ResolveReportDTO = z.infer<typeof resolveReportSchema>

export const banUserSchema = z.object({
  reason: z.string({ message: 'Ban reason is required' }).trim().min(1, 'Ban reason is required'),
  until: z.string().trim().optional()
})

export type BanUserDTO = z.infer<typeof banUserSchema>
