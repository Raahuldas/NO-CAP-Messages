import {z} from "zod"
import { usernameValidation } from "./signupSchema"

export const updateUsernameSchema = z.object({
    username: usernameValidation
})