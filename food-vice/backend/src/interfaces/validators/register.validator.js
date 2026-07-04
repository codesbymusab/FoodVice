const z = require("zod")

const registerSchema = z.object({
    name: z.string({ message: 'Name is required' }).min(2).max(100),
    username: z.string({ message: 'Username is required' }).min(2).max(100),
    email: z.string().email({ message: 'Please enter valid email' }),
    password: z.string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(/[!@#$%^&*()_+/~\-]/, 'Password must contain at least one special character'),
    confirmPassword: z.string(),
}).refine((data)=>
    data.password===data.confirmPassword,{message:"Passwords don't match"}
)

module.exports=registerSchema