import { UserModel } from "../models/user.model.js";
import ApiError from "../utils/ApiError.utils.js";
import AsyncHandler from "../utils/AsyncHandler.utils.js";
import jwt from 'jsonwebtoken'
const verifyJWT = AsyncHandler(async(req, res, next)=>{
    const token = req.cookies?.AccessToken || req.header('Authorization')?.replace("Bearer ","")
    if(!token) throw new ApiError(401,"Unauthorized request")
    const decoded = await jwt.decode(token,process.env.ACCESS_TOKEN_SECRET)
    if(!decoded) throw new ApiError(401,"Unauthorized request")
    const user = await UserModel.findById(decoded._id)
    if(!user){
        throw new ApiError(401, "Token Expired")
    }

    req.user = user;
    next()

})

export {verifyJWT}