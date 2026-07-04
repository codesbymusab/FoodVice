const z = require('zod')
const fileSchema = require('./file.validator')

const communitySchema = z.object({
    name: z.string({ error: 'Name is required' }).min(2).max(100),
    description: z.string({ error: 'Description is required' }).min(2).max(500),
    guidelines: z.array(z.string({ error: 'Invalid guidelines' })).min(0).max(10),
    file: fileSchema
    
})

module.exports = communitySchema