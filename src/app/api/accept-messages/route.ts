import dbConnect from "@/lib/dbConnect";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/models/user.model";
import { ApiResponse } from "@/types/ApiResponse";

export async function POST(requset: Request) {
    await dbConnect()
    const { acceptMessages } = await requset.json();
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
                    status: 402
                }
            )
        }
        const userId = user._id
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { isAcceptingMessages: acceptMessages },
            { new: true }
        )

        if (!updatedUser) {
            return Response.json(
                {
                    success: false,
                    message: "Unable to find user to update message acceptance status"
                },
                {
                    status: 404
                }
            )
        }

        return Response.json(
            {
                success: true,
                message: "Message updated successfully",
                updatedUser
            },
            {
                status: 200
            }
        )

    } catch (error) {
        return Response.json(
            {
                success: false,
                message: "Error updating accept messages status"
            },
            {
                status: 500
            }
        )
    }
}

export async function GET(requset: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user: User = session?.user
    
    console.log("session", session);
    
    
    if ( !session || !user) {
            return Response.json(
                {
                    success:false,
                    message: "Unauthorized user"
                },
                {
                    status: 402
                }
            )
        }
        
        const userId = user._id
        try {

        const foundUser = await UserModel.findById(userId);

        if (!foundUser) {
            return Response.json(
                {
                    success:false,
                    message: "User not found"
                },
                {
                    status: 404
                }
            )
        }

        return Response.json(
            {
                success:true,
                message: "message acceptance status fetched successfully",
                isAcceptingMessages: foundUser.isAcceptingMessages
            } as ApiResponse,
            {
                status: 200
            }
        )
    } catch (error) {
        return Response.json(
            {
                success: false,
                message: "Error fetching message acceptance status"
            },
            {
                status: 500
            }
        )
    }

}