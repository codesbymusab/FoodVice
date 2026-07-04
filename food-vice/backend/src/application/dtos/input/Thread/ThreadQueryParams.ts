import { z } from 'zod'

export const threadQuerySchema = z.object({
  search: z.string().optional(),
  topics: z.string().transform((topics) =>topics.split(',').filter(id => id)).optional().default([]),
})

export type ThreadQueryParams = z.infer<typeof threadQuerySchema>

