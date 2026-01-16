import mongoose, { Schema } from "mongoose";
import type { INoti } from "../Types/Model.Types.js";

const NotiSchema = new Schema<INoti>({
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "USERSCHEMA"
    },
    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "USERSCHEMA",
        required:true
    },
    type:{
        type:String,
        required:true,
        enum: ["follow", "like"]
    },
    read: {
        type:Boolean, /* Tracks whether the notification has been read by the user */
        default:false
    }

},
    { timestamps: true })

export const NOTISCHEMA = mongoose.model<INoti>("NOTISCHEMA", NotiSchema)