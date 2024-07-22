import sendVerification from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";
import bcryptjs from "bcryptjs"
export async function POST(request: Request) {
    await dbConnect();

    try {
        const { username, email, password } = await request.json();
        const existingVerifiedUserByUsername = await UserModel.findOne({
            username,
            isVerified: true
        })

        if (existingVerifiedUserByUsername) {
            return Response.json({
                success: false,
                message: "username is already taken"
            }, {
                status: 400
            })
        }

        const existingUserByEmail = await UserModel.findOne({ email });
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                return Response.json({
                    success: false,
                    message: "User already exist with this email"
                }, {
                    status: 400
                })
            } else {

                const hashedPassword = await bcryptjs.hash(password, 10);

                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
                await existingUserByEmail.save();
            }

        } else {

            const hashedPassword = await bcryptjs.hash(password, 10)
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);

            const newUser = new UserModel(
                {
                    username,
                    email,
                    password: hashedPassword,
                    verifyCode,
                    verifyCodeExpiry: expiryDate,
                    isVerified: false,
                    isAcceptingMessages: true,
                    messages: []
                }
            );

            await newUser.save();
        }

        const emailResponse = await sendVerification(username, email, verifyCode);
        if (!emailResponse.success) {
            return Response.json(
                {
                    success: false,
                    message: emailResponse.message
                },
                {
                    status: 400
                }
            )
        }

        return Response.json(
            {
                success:true,
                message: "User Registered Successfully, Please verify your email"
            },
            {
                status:201
            }
        )

    } catch (error: any) {
        console.log(error);
        return Response.json({
            success: false,
            message: error.message
        })
    }
}