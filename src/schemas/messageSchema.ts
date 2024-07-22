import { z } from "zod";

export const messageSchema = z.object({
    content: z
        .string()
        .min(2, "content must have atleast 2 characters ")
        .max(300, "content must not have more than 300 characters")
}) 