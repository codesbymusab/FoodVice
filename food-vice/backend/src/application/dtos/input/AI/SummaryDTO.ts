import { z } from 'zod'
import { decodeCursor } from '../../../../shared/utils/cursorPagination';

export const aiSummarySchema = z.object({

  restaurantId: z.string(),
  limit: z.coerce.number().int().min(1).max(10).optional().default(5),
  restaurantName: z.string(),
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
});

export type AISummaryDTO = z.infer<typeof aiSummarySchema>
