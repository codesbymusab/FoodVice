const z = require('zod')
const fileSchema = require('./file.validator')

const threadSchema = z.object({
    communityId: z.string({ error: 'CommunityID is required' }).min(2).max(100),
    title: z.string({ error: 'Title  is required' }).min(2).max(100),
    content: z.string({error:"No content provided"}).min(2).max(500),
    topics: z.string({error:"Incorrect tags format"})
        .transform((str) => {
          try {
            return JSON.parse(str);
          } catch {
            throw new Error("Invalid JSON in topics field");
          }
        }
        ).pipe(z.array(z.string({error:'Invalid Topic'}))).optional(),
    files: z.array(fileSchema).min(0).max(10),  
})

module.exports = threadSchema

