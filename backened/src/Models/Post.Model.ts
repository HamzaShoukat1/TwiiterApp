import mongoose, { Schema } from "mongoose";
import type { IPost } from "../Types/Model.Types.js";
const postSchema = new Schema<IPost>({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "USERSCHEMA",
        required: true,
    },
    text: {
        type: String,
        trim: true //remvoe spaces

    },
    postimg: {
        type: String,
        default: "",
    },
    likes: [
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: "USERSCHEMA",
    }
],
    comments: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "USERSCHEMA",
                required: true,
            },
            text: {
                type: String,
                required: true
            },
                createdAt: {
                type: Date,
                default: Date.now
            }
        }

    ],


},
    { timestamps: true })


export const POSTSCHEMA = mongoose.model<IPost>("POSTSCHEMA", postSchema) 