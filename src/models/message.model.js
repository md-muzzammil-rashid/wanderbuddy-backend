import mongoose, { Schema } from "mongoose";

const messageSchema = new Schema({
    sender: { type: Schema.Types.ObjectId, ref: "User" },
    message: {
        type: String,
        required: true
    },
    createdAt:
        { type: Date, default: Date.now },
    seenBy: [
        {
            userId: {
                type: Schema.Types.ObjectId,
                ref: "User"
            },
            timestamp: {
                type: Date
            }
        }
    ],
    tripId: {
        type: Schema.Types.ObjectId, ref: "Trip"
    },
    mediaType: {
        type: String
    },
    mediaUrl: {
        type: String,
        default: null
    }

})

export const MessageModel = mongoose.model("Messages", messageSchema)