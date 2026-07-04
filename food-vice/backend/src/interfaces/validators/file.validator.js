const z = require('zod')

const fileSchema = z.object({
    originalname: z.string(),
    mimetype: z.string(),
},{error:'Invalid File Attached'})

module.exports=fileSchema