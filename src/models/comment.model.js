import mongoose, { mongo } from "mongoose";

const nestedCommentSchema = new mongoose.Schema( {
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    replyText: {
        type: String,
        required: true
    },
    likes:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    }]
},{timestamps:true})

const CommentSchema = new mongoose.Schema({
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Posts'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    content: {
        type: String,
        required: true
    },
    likes:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    replies:[
       { type: nestedCommentSchema}
    ]
}, {timestamps: true})

export const CommentModel = mongoose.model("Comments", CommentSchema)