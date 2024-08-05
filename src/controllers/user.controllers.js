import AsyncHandler from '../utils/AsyncHandler.utils.js'
import ApiError from '../utils/ApiError.utils.js'
import ApiResponse from '../utils/ApiResponse.utils.js'
import { UserModel } from '../models/user.model.js'
import { options } from '../utils/Constant.utils.js'

const createUser = AsyncHandler(async (req, res, next) => {
    const { username, password, displayName, email } = req.body
    if ([username, password, displayName, email].some((field) => field?.trim() == ("" || undefined || null)))
        throw new ApiError(400, "All Fields are required")
    const existedUser = await UserModel.findOne({ $or: [{ username: username }, { email: email }] })
    if (existedUser) throw new ApiError(409, "User with same Username or Email already existed")
    const user = await UserModel.create({
        username,
        password,
        email,
        profile: { displayName }
    })
    if (!user) throw new ApiError(501, "Failed to Create User")
    const createdUser = await UserModel.findById(user._id).select("-password -refreshToken")
    return res.status(201)
        .json(
            new ApiResponse(201, "User Created", createdUser)
        )
})

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await UserModel.findById(userId)
        const AccessToken = await user.generateAccessToken()
        const RefreshToken = await user.generateRefreshToken()
        user.refreshToken = RefreshToken
        await user.save({ validateBeforeSave: false }).then(() =>
            console.log("Refresh token saved")

        ).catch((err) => console.log("Failed to save refresh token"))
        return { AccessToken, RefreshToken }
    } catch (error) {
        throw new ApiError(500, "Failed to create tokens", error)
    }
}

const loginUser = AsyncHandler(async (req, res, next) => {
    console.log("Login Api hited");
    const { usernameORemail, password } = req.body

    if ([usernameORemail, password].some((field) => (field?.trim() == null) || (field?.trim() == "")|| field?.trim() == undefined)) {
        return res.status(200)
            .json(
                new ApiResponse(400, "All fields are required", {}, false)
            )
    }

    const user = await UserModel.findOne({ $or: [{ username: usernameORemail.trim().toLowerCase() }, { email: usernameORemail }] })
    if (!user) {
        return res.status(200)
            .json(
                new ApiResponse(404, "User not found", {}, false)
            )
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password)

    if (!isPasswordCorrect) {
        return res.status(200)
            .json(
                new ApiResponse(401, "Invalid Credentials", {}, false)
            )
    }

    const { AccessToken, RefreshToken } = await generateAccessAndRefreshToken(user._id)

    return res.status(202)
        .cookie("AccessToken", AccessToken, options)
        .cookie("RefreshToken", RefreshToken, options)
        .json(
            new ApiResponse(202, "Login Successful", { AccessToken, RefreshToken, user })
        )
})

const logoutUser = AsyncHandler(async (req, res, next) => {
    await UserModel.findByIdAndUpdate(req.user._id, { $set: { refreshToken: null } }, { new: true })
        .then(() => {
            res.status(200)
                .clearCookie("accessToken", options)
                .clearCookie("refreshToken", options)
                .json(
                    new ApiResponse(201, "Logout Successful", {})
                )
        })
    return res.status()
})

const getUserData = AsyncHandler(async (req, res, next) => {
    const user = await UserModel.findById(req.user._id).select("-password -refreshToken")
    if (!user) throw new ApiError(404, "User not found")
    return res.status(200)
       .json(
            new ApiResponse(200, "User fetched successfully", user)
        )
})

export {
    createUser,
    loginUser,
    logoutUser,
    getUserData
}