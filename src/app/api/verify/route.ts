import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";

export async function POST(request: Request) {
    await dbConnect();
    try {
        
        const {username, code} = await request.json();
        const decodedUsername = decodeURIComponent(username);
        const user = await UserModel.findOne({username: decodedUsername});

        if (!user) {
            return Response.json(
                {success: false,message: "User not found"},
                {status:404}
            )
        }

        const isCodeValid = user.verifyCode === code;
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

        if (isCodeValid && isCodeNotExpired) {
            user.isVerified = true;
            await user.save();
            return Response.json(
                {success:true, message: "User verified successfully"},
                {status:201}
            )
        }else if (!isCodeNotExpired) {
            return Response.json(
                {success:false, message: "Verification code is expired, Sign up again"},
                {status:400}
            )
        } else{
            return Response.json(
                {success:false, message: "Verification code is Incorrect"},
                {status:400}
            )
        }

    } catch (error: any) {
        console.log(error.message);
        
        Response.json(
            {success:false, message: "Error verifying user"},
            {status:500}
        )
    }
}