const z = require('zod')


const profileSchema =  z.object({

    name: z.string({ message: 'Name is required' }).min(2).max(100),
    username: z.string({ message: 'Username is required' }).min(2).max(100),
    email: z.string().email({ message: 'Please enter valid email' }),
    bio: z.string({ error: "Bio is required" }).min(0).max(300),
    address: z.string({ error: "Address is required" }).min(0).max(100),
    country: z.string({ error: "Country is required" }),
    city: z.string({ error: "City is required" }),
    provider: z.enum(["google", "local"], { error: "Incorrect provider" }),
    confirmPassword: z.never(),
    profilePhoto: z.file({ error: "Incorrect file format" }).optional(),
    password: z.string({ error: "Current Password not provided " }),
    newPassword: z.string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(/[!@#$%^&*()_+/~\-]/, 'Password must contain at least one special character').optional(),
    confirmPassword: z.string().optional(),
}).refine((data) => {
    if (data.newPassword && data.newPassword !== data.confirmPassword) {
        return { message: "Passwords don't match" }
    }
}
)


module.exports = profileSchema

