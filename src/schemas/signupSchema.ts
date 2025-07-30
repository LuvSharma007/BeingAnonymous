import { z} from 'zod'

export const usernameValidation = z
.string()
.min(2,"Username must be atleast 2 characters")
.max(10,"Username must be not more than 10 characters")
.regex(/^[a-zA-Z0-9_]+$/,"special character & space not allowed ")


export const signupSchema = z.object({
    username:usernameValidation,
    email:z.string().email({message:"Invalid email address"}),
    password:z.string().min(6,{message:"Password must be atleast 6 characters"}).max(12,{message:"password must be not more than 12 characters"})
})

