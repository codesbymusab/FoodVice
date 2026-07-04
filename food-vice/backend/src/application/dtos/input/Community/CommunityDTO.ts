import fileSchema from "../../../../interfaces/validators/file.validator"

import { z } from 'zod'


const communitySchema = z.object({
    name: z.string({ error: 'Name is required' }).min(2).max(100),
    description: z.string({ error: 'Description is required' }).min(2).max(500),
    guidelines: z.array(z.string({ error: 'Invalid guidelines' })).min(0).max(10),
    file: fileSchema
    
})

export type CommunityDTO = z.infer<typeof communitySchema>
