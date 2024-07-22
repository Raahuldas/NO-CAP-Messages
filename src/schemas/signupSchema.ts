import {z} from 'zod';

export const usernameValidation = z
    .string()
    .min(4,"Username must have atleast 4 characters")
    .max(16,"Username must have atmost 16 Characters")
    .regex(/^[a-zA-Z0-9._]+$/,"username can only contain Alphabets, Numbers, Dot and UnderScore. special character's not Allowed ")

export const signupSchema = z.object({
    username:usernameValidation,
    email: z.string().email({message:"Invalid email address"}),
    password: z.string().regex(/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){8,}$/,"password must contain atleast 8 characters a Capital letter, a small letter, a number, and a special character ")
})