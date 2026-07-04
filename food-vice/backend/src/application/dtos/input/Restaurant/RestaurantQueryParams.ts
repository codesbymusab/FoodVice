import { z } from 'zod'
import { decodeCursor } from '../../../../shared/utils/cursorPagination';

export const restListQuerySchema = z.object({
  lat: z.coerce.number(),
  lon: z.coerce.number(),
  cuisine: z.string().optional().default('All'),
  price: z.enum(['', '$', '$$', '$$$']).optional().default(''),
  rating: z.coerce.number().optional().default(0),
  dist: z.coerce.number().optional().default(50),
  limit: z.coerce.number().optional(),
  cursor: z
    .union([
      z.string().transform((cur) => {
        try {
      
          return decodeCursor(cur)
          
        } catch {
          throw new Error("Invalid cursor JSON");
        }
      }).pipe(
        z.object({
          _id: z.string(),
          avgOverall: z.number(),
        }, { error: "Invalid Cursor" })
      ),
      z.undefined(),
    ])
    .optional(),

  sortBy: z.string().optional(),
})

export type RestListQueryParams = z.infer<typeof restListQuerySchema>

export const restDetailsQuerySchema = z.object({

  lat: z.coerce.number(),
  lon: z.coerce.number(),

})

export type RestDetailsQueryParams = z.infer<typeof restDetailsQuerySchema>


export const similarRestQuerySchema = z.object({
  lat: z.coerce.number(),
  lon: z.coerce.number(),

})

export type SimilarRestQueryParams = z.infer<typeof similarRestQuerySchema>

export const postViewQuerySchema = z.object({

  meta: z.string().optional()

})

export type PostViewParams = z.infer<typeof postViewQuerySchema>

