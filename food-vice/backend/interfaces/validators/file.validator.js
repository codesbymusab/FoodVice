const z = require('zod')
const zfd = require('zod-form-data')

const fileSchema = z.object({
    originalname: z.string(),
    mimetype: z.string(),
},{error:'Invalid File Attached'})

module.exports=fileSchema