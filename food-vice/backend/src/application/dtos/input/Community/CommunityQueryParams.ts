import { z } from 'zod'

export const communityQuerySchema = z.object({
  name: z.string().optional(),

})

export type CommunityQueryParams = z.infer<typeof communityQuerySchema>
