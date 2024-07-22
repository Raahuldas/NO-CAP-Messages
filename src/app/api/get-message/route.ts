import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import mongoose from "mongoose";
import UserModel from "@/models/user.model";

export async function GET(request:Request) {
    await dbConnect()
    try {
        const session = await getServerSession(authOptions);
        const user: User = session?.user

        if (!session || !user) {
            return Response.json(
                {
                    success: false,
                    message: "Unauthorized user"
                },
                {
                    status:401
                }
            )
        }

        const userId = new mongoose.Schema.ObjectId(user._id!);

        const newUser = await UserModel.aggregate([
            {
                $match: {_id: userId}
            },
            {
                $unwind:'$messages'
            },
            {
                $sort: {'messages.createdAt': -1}
            },
            {
                $group: {
                    _id: '$_id',
                    messages: {$push: '$messages'}
                }
            }
        ])

        if (!newUser || newUser.length == 0) {
            return Response.json(
                {
                    success: false,
                    message: "User not found"
                },
                {
                    status:404
                }
            )
        }

        return Response.json(
            {
                success: true,
                message: newUser[0].messages
            },
            {
                status:200
            }
        )

    } catch (error) {
        console.log("Error fetching messages",error);
        return Response.json(
            {
                success: false,
                message: "Error fetching message"
            },
            {
                status:500
            }
        )
    }
}