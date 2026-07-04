import { z } from 'zod'


export const loginSchema = z.object({

    email: z.email({error:"Please enter valid email"}),
    password: z.string({error:"Password not entered"})
        
})

export type LoginDTO = z.infer<typeof loginSchema>
