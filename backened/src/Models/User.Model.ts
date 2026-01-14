import mongoose, { Schema } from "mongoose";
import type  { IUser } from "../Types/Model.Types.js";
const userSchema = new Schema<IUser>({
    username: {
        type: String,
        required: true,
        unique: true
    },
    fullName: {
        type: String,
        required: true,

    },
    password: {
        type: String,
        required: true,
        minLenth: 6
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    followers:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        default:[]
    }],
      following:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        default:[]
    }],
    profileImage: {
        type:String,
        default: "",
    },
    coverImage: {
        type:String,
        default: ""
    },
    bio: {
        type:String,
        default: ""
    },
    link: {
        type:String,
        default: ""
    },

},
    { timestamps: true })


export const USERSCHEMA = mongoose.model<IUser>("USERSCHEMA",userSchema) 