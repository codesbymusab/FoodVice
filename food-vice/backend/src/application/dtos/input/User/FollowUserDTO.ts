
import { z } from 'zod'

export const followUserSchema = z.object({


    followerId: z.string(),
    followingId: z.string()


})
export type FollowUserDTO = z.infer<typeof followUserSchema>
