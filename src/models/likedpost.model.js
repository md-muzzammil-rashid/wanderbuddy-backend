import mongoose from "mongoose";

const LikePostSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }
})

export const LikedPostModel = mongoose.model('LikePosts', LikePostSchema);