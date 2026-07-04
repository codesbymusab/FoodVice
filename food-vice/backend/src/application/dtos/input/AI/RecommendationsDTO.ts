import { z } from 'zod'

export const aiRecommendationsSchema = z.object({

  limitCount: z.coerce.number().int().min(1).max(10).optional().default(5),
  query:z.string(),
  location:z.object({
    lat:z.coerce.number(),
    lon:z.coerce.number(),
    distance:z.coerce.number().optional().default(50),
  })
})

export type AIRecommendationsDTO= z.infer<typeof aiRecommendationsSchema>
