import { z } from 'zod'
import { decodeCursor } from '../../../../shared/utils/cursorPagination';

export const userReelQuerySchema = z.object({

    limit: z.coerce.number().int().min(1).max(50).default(20),
    sortBy: z.enum(['createdAt', 'likesCount']).default('createdAt'),
    tag: z.string().optional(),
    savedCursor: z.transform((cur: string | undefined) => {
        if (cur) {
            try {
                return decodeCursor(cur)
            } catch {
                throw new Error("Invalid cursor");
            }
        }
        else {
            return cur
        }
    }
    ).pipe(z.object({ createdAt: z.number() }, { error: 'Invalid Cursor' })).optional(),
    userCursor: z.transform((cur: string | undefined) => {
        if (cur) {
            try {
                return decodeCursor(cur)
            } catch {
                throw new Error("Invalid cursor");
            }
        }
        else {
            return cur
        }
    }
    ).pipe(z.object({}, { error: 'Invalid Cursor' })).optional(),
})

export type UserReelsQueryParams = z.infer<typeof userReelQuerySchema>

export const reelQuerySchema = z.object({

    limit: z.coerce.number().int().min(1).max(50).default(20),
    sortBy: z.enum(['createdAt', 'likesCount']).default('createdAt'),
    tag: z.string().optional(),
    cursor: z.transform((cur: string | undefined) => {
        if (cur) {
            try {
                return decodeCursor(cur)
            } catch {
                throw new Error("Invalid JSON in tags field");
            }
        }
    }
    ).pipe(z.object({ createdAt: z.number() }, { error: 'Invalid Cursor' })).optional(),

})

export type ReelQueryParams = z.infer<typeof reelQuerySchema>

export const reelLikeQuerySchema = z.object({

    reelId: z.string()
})

export type ReelLikeParams = z.infer<typeof reelLikeQuerySchema>


export const reelCommentLikeQuerySchema = z.object({

    commentId: z.string()
})

export type ReelCommentLikeParams = z.infer<typeof reelCommentLikeQuerySchema>

export const popularTagsQuerySchema = z.object({

    limit: z.coerce.number().optional().default(10)
})

export type PopularTagsParams = z.infer<typeof popularTagsQuerySchema>

export const suggestedAccQuerySchema = z.object({

    limit: z.coerce.number().optional().default(10)
})

export type SuggestedAccParams = z.infer<typeof suggestedAccQuerySchema>

export const getReelQuerySchema = z.object({

    reelId: z.string()
})

export type GetReelParams = z.infer<typeof getReelQuerySchema>



