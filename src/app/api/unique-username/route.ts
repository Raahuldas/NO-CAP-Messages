import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";
import { usernameValidation } from "@/schemas/signupSchema";
import { z } from "zod";

const usernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(request: Request) {
    await dbConnect();
    try {
        const {searchParams} = new URL(request.url);
        const queryParam = {
            username: searchParams.get('username')
        }

        const result = usernameQuerySchema.safeParse(queryParam);
        
        if (!result.success) {
            const usernameError = result.error.format().username?._errors || []
            return Response.json(
                {
                    success: false,
                    message: usernameError.length > 0? usernameError.join(",") : "Invalid query parameter"
                },
                {
                    status: 400
                }
            )
        }
        const {username} = result.data;

        const existingVerifiedUser = await UserModel.findOne({
            username,
            isVerified: true
        })

        if (existingVerifiedUser) {
            return Response.json(
                {
                    success: false,
                    message: "Username already taken"
                },
                {
                    status:400
                }
            )
        }

        return Response.json(
            {
                success: true,
                message: "Username is available"
            },
            {
                status:200
            }
        )

    } catch (error) {
        console.log(error);
        return Response.json(
            {
                success: false,
                message: "Error while checking username"
            },
            {
                status:500
            }
        )       
    }
}