import mongoose from "mongoose";

export const PostSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    caption:{
        type:String,
    },
    tags:[{
        type:String,
        lowercase:true,
    }],
    location:{
        type:String
    },
    place:{
        type:String
    },
    photo:{
        type:String
    }
    
},{timestamps:true})

export const PostModel = mongoose.model("Posts", PostSchema)