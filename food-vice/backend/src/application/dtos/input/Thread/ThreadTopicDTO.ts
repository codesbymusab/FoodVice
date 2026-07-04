import { z } from 'zod'

export const threadTopicSchema = z.object({
  
  name: z.string(),
 
})
export type ThreadTopicDTO = z.infer<typeof threadTopicSchema>
