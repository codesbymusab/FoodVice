import { z } from 'zod'

export const aiChatSchema = z.object({
  
  limitCount: z.coerce.number().int().min(1).max(10).optional().default(5),
  messages:z.string(),
  location:z.object({
    lat:z.coerce.number(),
    lon:z.coerce.number(),
    distance:z.coerce.number().optional().default(50),
  })
})

export type AIChatDTO= z.infer<typeof aiChatSchema>
