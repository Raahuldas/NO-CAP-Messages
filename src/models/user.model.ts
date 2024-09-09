import mongoose, {Schema, Document} from "mongoose";

export interface Message extends Document{
    content: string;
    createdAt: Date
}

const messageSchema: Schema<Message> = new Schema({
    content:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default: Date.now
    }
})

export interface User extends Document{
    username:string;
    email: string;
    password:string;
    verifyCode:string;
    verifyCodeExpiry:Date;
    isVerified: boolean;
    isAcceptingMessages:boolean;
    messages:Message[];
    googleId: string;
}

const userSchema: Schema<User> = new Schema({
    username: {
        type:String,
        required:[true,"Username is required"],
        unique:true,
        trim: true,
    },
    email:{
        type:String,
        required:[true,"Email is required"],
        unique:true,
        // match:[ /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ , "Please enter valid email"]
        match:[ /\b[\w\.-]+@[\w\.-]+\.\w{2,4}/ , "Please enter valid email"]
    },
    password:{
        type:String,
        // required:[true,"Password is required"],
    },
    verifyCode:{
        type:String,
        // required:[true,"Verify code is required"],
    },
    verifyCodeExpiry:{
        type:Date,
        // required: [true,"Verify code expiry is required"]
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    isAcceptingMessages:{
        type:Boolean,
        default:true
    },
    messages:[messageSchema],
    googleId:{
        type: String
    }
})

const UserModel = mongoose.models.User as mongoose.Model<User> || mongoose.model<User>("User",userSchema);

export default UserModel;