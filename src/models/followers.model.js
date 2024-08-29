import { Mongoose, Schema } from "mongoose";

const followSchema = new Schema( {
    followedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    follows: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }

})

export const FollowModel = Mongoose.model('Follow', followSchema)