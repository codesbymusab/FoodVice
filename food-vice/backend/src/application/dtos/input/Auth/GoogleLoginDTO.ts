
import { z } from 'zod'


export const googleLoginSchema = z.object({


    access_token: z.string({ error: "Access token not provided" })

})

export type GoogleLoginDTO = z.infer<typeof googleLoginSchema>
