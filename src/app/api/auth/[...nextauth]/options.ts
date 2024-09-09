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
                console.log(profile,"------profile");
                
                return {
                    id: profile.sub,
                    name:profile.name,
                    username: ((profile.given_name + profile.family_name + Math.floor(Math.random()*100)).toString()).toLowerCase(),
                    email: profile.email,
                    isVerified: profile.email_verified,
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

            if (account?.provider == "google") {
                try {
                    const existingUser = await UserModel.findOne({email: user.email});
                    token._id = existingUser?._id?.toString();
                    token.username = existingUser?.username;
                    token.isAcceptingMessages = existingUser?.isAcceptingMessages;
                    token.isVerified = existingUser?.isVerified;
                } catch (error) {
                    throw new Error("error while login")
                }
            }else{
                console.log("-----------------user------------",user);

                token._id = user._id?.toString()
                token.username = user.username
                token.isVerified = user.isVerified
                token.isAcceptingMessages = user.isAcceptingMessages
            }
               
            }
            
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
        signIn: async ({account, user}) => {
            console.log(account, user);
            
            if (account?.provider == "google") {
                try {
                    const {email, username, id, isVerified} = user;

                    await dbConnect();

                    const existingUser = await UserModel.findOne({email});
                    if (existingUser) {
                        return true;
                    }

                    if (!existingUser) {
                        await UserModel.create({email, username, googleId:id, isVerified:isVerified})
                    }

                    return true;
                } catch (error) {
                    console.log(error);
                    throw null
                }
            }

            if (account?.provider == "credentials") {
                return true;
            }

            return false;
        }
    },
    pages:{
        signIn:"/signin"
    },
    session:{
        strategy: "jwt"
    },
    secret:process.env.NEXTAUTH_SECRET,
}