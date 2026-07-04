import { z } from 'zod'
import fileSchema from '../../../../interfaces/validators/file.validator'

export const threadCommentSchema = z.object({
  content: z.string().min(3).max(300),
  file: z.array(fileSchema).optional().default([]),
})

export type ThreadCommmentDTO = z.infer<typeof threadCommentSchema>
