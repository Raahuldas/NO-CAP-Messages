import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import mongoose from "mongoose";
import UserModel from "@/models/user.model";

export async function GET(request: Request) {
    await dbConnect()
    try {
        const session = await getServerSession(authOptions);
        const user: User = session?.user;
        console.log(user,"useer");
        

        if (!session || !user) {
            return Response.json(
                {
                    success: false,
                    message: "Unauthorized user"
                },
                {
                    status: 401
                }
            )
        }

        const userId = new mongoose.Types.ObjectId(user._id);

        const newUser = await UserModel.aggregate([
            {
                $match: { _id: userId }
                // $match: { $or:[{_id: userId},{email:userEmail}] }
            },
            {
                $unwind: '$messages'
            },
            {
                $sort: { 'messages.createdAt': -1 }
            },
            {
                $group: {
                    _id: '$_id',
                    messages: { $push: '$messages' }
                }
            }
        ])        

        if (!newUser || newUser.length == 0) {
            return Response.json(
                {
                    success: false,
                    message: "There's no message for you"
                },
                {
                    status: 404
                }
            )
        }

        return Response.json(
            {
                success: true,
                message: "Message Fetched Successfully",
                messages: newUser[0].messages
            },
            {
                status: 200
            }
        )

    } catch (error) {
        console.log("Error fetching messages", error);
        return Response.json(
            {
                success: false,
                message: "Error fetching message"
            },
            {
                status: 500
            }
        )
    }
}