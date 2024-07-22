import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcryptjs from "bcryptjs"

export const authOptions: NextAuthOptions = {
    providers:[
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text ", placeholder: "jsmith" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials:any ): Promise<any> {
                await dbConnect();
                try {
                    
                    const user = await UserModel.findOne({
                        $or:[
                            {email: credentials.identifier},
                            {username : credentials.identifier}
                        ]
                    })

                    if (!user) {
                        throw new Error("No user found with this email")
                    }

                    if (!user.isVerified) {
                        throw new Error("Please verify your email before login")
                    }

                    const isPasswordCorrect = await bcryptjs.compare(credentials.password,user.password)
                    if (isPasswordCorrect) {
                        return user
                    }else{
                        throw new Error("Incorrect Password")
                    }
                        
                } catch (error:any) {
                    throw new Error(error)
                }
            },
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            profile(profile){
                return {
                    id: profile.sub,
                    name: profile.name
                }
            },
            authorization: {
                params: {
                  prompt: "consent",
                  access_type: "offline",
                  response_type: "code"
                }
            }
          })
    ],
    callbacks: {
        async jwt({ token, user, account, profile }) {
            if (user) {
                token._id = user._id?.toString(),
                token.username = user.username,
                token.isVerified = user.isVerified,
                token.isAcceptingMessages = user.isAcceptingMessages

            }
            if( account?.provider == 'google' && profile){
                token.id = profile.sub;
                token.name = profile.name;
            }
            
            console.log(token,"***************Token");
            
          return token
        },
        async session({ session, token }) {
            if (token) {
                session.user._id = token._id
                session.user.username = token.username
                session.user.isVerified = token.isVerified
                session.user.isAcceptingMessages = token.isAcceptingMessages
                session.user.id = token.id
                session.user.name = token.name
            }
            return session
        },   
    },
    pages:{
        signIn:"/signin"
    },
    session:{
        strategy: "jwt"
    },
    secret:process.env.NEXTAUTH_SECRET,
}