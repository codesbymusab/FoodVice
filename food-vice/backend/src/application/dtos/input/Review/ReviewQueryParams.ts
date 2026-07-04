import { z } from 'zod'
import { decodeCursor } from '../../../../shared/utils/cursorPagination';


export const reviewQuerySchema = z.object({

    limit: z.coerce.number().int().min(1).max(50).default(20),
    sortBy: z.enum(['createdAt', 'likesCount']).default('createdAt'),
    cursor: z.transform((cur: string | undefined) => {
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

})

export type ReviewQueryParams = z.infer<typeof reviewQuerySchema>

export const reviewLikeQuerySchema = z.object({

    commentId: z.string()
})

export type ReviewLikeParams = z.infer<typeof reviewLikeQuerySchema>

