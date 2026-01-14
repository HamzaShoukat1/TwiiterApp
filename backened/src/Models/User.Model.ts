import mongoose, { Schema } from "mongoose";
import type { IUser } from "../Types/Model.Types.js";
import bcrypt from "bcryptjs";
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
        minLenth: 6,
        select:false
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: []
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: []
    }],
    profileImage: {
        type: String,
        default: "",
    },
    coverImage: {
        type: String,
        default: ""
    },
    bio: {
        type: String,
        default: ""
    },
    link: {
        type: String,
        default: ""
    },
    refreshToken:{
        type:String,
        select:true
    }

},
    { timestamps: true })

userSchema.pre("save", async function (): Promise<void> {
    if (!this.isModified("password")) return

    this.password = await bcrypt.hash(this.password, 10)

})

userSchema.methods.isPasswordCorrect = async function(password:string):Promise<boolean>{
    return await bcrypt.compare(password,this.password)
}

export const USERSCHEMA = mongoose.model<IUser>("USERSCHEMA", userSchema) 