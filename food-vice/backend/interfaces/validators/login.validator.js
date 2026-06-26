const z = require("zod")

const loginSchema = z.object({

    email: z.string({error:"Email not entered"}).email({ message: 'Please enter valid email' }),
    password: z.string({error:"Password not entered"})
        
})

module.exports=loginSchema