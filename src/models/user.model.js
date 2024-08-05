import mongoose from "mongoose";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { PostSchema } from "./post.schema.js";

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    wishlist: [{
        type: Object
    }],
    travelHistory: [{
        type: Object
    }],
    email:{
        type:String,
        required:true,
        unique:true
    },
    refreshToken:{
        type:String
    },
    profile: {
        displayName: {
            type: String
        },
        avatar: {
            type: String,
            default: "https://img.freepik.com/premium-photo/graphic-designer-digital-avatar-generative-ai_934475-9193.jpg"
        },
        coverPhoto:{
            type:String
        },
        bio: {
            type: String
        },
        followers: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        following: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }]
    },
    post: [{
        type: PostSchema
    }],
    searchHistory: [{
        type: Object
    }]
})

UserSchema.pre('save', async function ( next) {
    if (!this.isModified('password')) next()
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

UserSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

UserSchema.methods.generateAccessToken = async function () {
    return jwt.sign({
        username: this.username,
        _id: this._id
    },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        })
}
UserSchema.methods.generateRefreshToken = async function () {
    return jwt.sign({
        _id: this._id
    },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        })
}


export const UserModel = mongoose.model("User", UserSchema)