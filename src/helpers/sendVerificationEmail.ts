import resend from "@/lib/resend";
import { ApiResponse } from "@/types/ApiResponse";
import VerificationEmail from "../../emails/verificationEmail";

export default async function sendVerification(
    username: string,
    email:string,
    verifyCode: string
): Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: 'NO-CAP MESSAGES',
            react: VerificationEmail({ username, otp: verifyCode })
        });
        return {success:true, message:"Verification email sent successfully"}

    } catch (error) {
        console.log("Error while sending verification email",error);
        return {success:false, message:"Failed to send Verification email."}
    }
}