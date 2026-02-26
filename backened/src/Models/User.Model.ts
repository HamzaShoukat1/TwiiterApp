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
        minLength: 6,
    },

    email: {
        type: String,
        required: true,
        unique: true
    },
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "USERSCHEMA",
        default: []
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "USERSCHEMA",
        default: []
    }],
    profileImage: {
        url: {
            type: String,
            default: "",
        },

        publicId: {
            type: String,
        }
    },
    coverImage: {
        url: {
            type: String,
            default: "",
        },

        publicId: {
            type: String,
        }
    },

    bio: {
        type: String,
        default: ""
    },
    link: {
        type: String,
        default: ""
    },
    likedPost: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "POSTSCHEMA",
            default: []
        },
    ],
    refreshToken: {
        type: String,
    },
    lastlogin: {
        type: Date,
        default: Date.now

    },
    isVerified: {
        type: Boolean,
        default: false
    },
    resetpasswordtokens: String,
    resetpasswordExpiresAt: Date,
    emailverificationToken: String,
    emailverificationTokenExpiresAt: Date,

},



    { timestamps: true })

userSchema.pre("save", async function (): Promise<void> {
    if (!this.isModified("password")) return

    this.password = await bcrypt.hash(this.password, 10)

})

userSchema.methods.isPasswordCorrect = async function (password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password)
}

export const USERSCHEMA = mongoose.model<IUser>("USERSCHEMA", userSchema) 