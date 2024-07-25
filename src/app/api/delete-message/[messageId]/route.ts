import dbConnect from "@/lib/dbConnect";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import UserModel from "@/models/user.model";

export async function DELETE(request: Request,{params}:{params: {messageId: string}}) {
    await dbConnect();
    try {
        const messageId = params.messageId;
        const session = await getServerSession(authOptions);
        const user : User = session?.user;

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

        const updatedResult = await UserModel.updateOne(
            {
                _id: user._id
            },
            {
                $pull:{messages: {_id: messageId}}
            }
        )
        
        console.log(updatedResult);
        
        return Response.json(
            {
                success: true,
                message: "Message deleted successfully"
            },
            {
                status:200
            }
        )

    } catch (error) {
        
    }
}