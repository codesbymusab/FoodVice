const z = require('zod')

const threadSchema = z.object({
    communityId: z.string({ error: 'CommunityID is required' }).min(2).max(100),
    title: z.string({ error: 'Title  is required' }).min(2).max(100),
    content: z.string({error:"No content provided"}).min(2).max(500),
    topics: z.array(z.string({error:"No topic selected"})).min(1),
    media: z.array(z.array(z.file({ error: 'Invalid Media Files' }))).min(0).max(10),  
})

module.exports = threadSchema

