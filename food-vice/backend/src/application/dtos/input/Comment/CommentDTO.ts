import { z } from 'zod'

export const commentSchema = z.object({
  text:z.string().min(2).max(200)
})

export type CommentDTO = z.infer<typeof commentSchema>
