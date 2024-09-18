import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export async function POST(request: Request) {
    await dbConnect();
    try {
        const session = await getServerSession(authOptions);

        const user: User = session?.user;

        if (!session || !user) {
            return Response.json(
                {
                    success: false,
                    message: "Unauthorized user"
                },
                {
                    status:400
                }
            )
        }

        const {username} = await request.json();

        const updatedUser = await UserModel.findOneAndUpdate(
            {_id:user._id},
            {
                username
            },
            {
                new:true
            }
        )

        if (!updatedUser) {
            return Response.json(
                {
                    success: false,
                    message: "error updating updating username"
                },
                {
                    status:400
                }
            )
        }

        return Response.json(
            {
                success: true,
                message: "Username updated successfully"
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
                message: "Error while updating username",
            },
            {
                status: 500
            }
        )
    }
}