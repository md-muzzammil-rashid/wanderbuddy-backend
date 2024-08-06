import { MessageModel } from "../models/message.model.js";
import { TripModel } from "../models/trip.model.js";
import ApiError from "../utils/ApiError.utils.js";
import ApiResponse from "../utils/ApiResponse.utils.js";
import AsyncHandler from "../utils/AsyncHandler.utils.js";
import {io} from '../socket/socket.js'

const sendMessage = AsyncHandler(async (req, res)=>{
    const { message, mediaType, mediaUrl } = req.body
    
    const {tripId} = req.params
    const sender = req.user._id
    
    const newMessage = new MessageModel({
        sender,
        message,
        mediaType,
        mediaUrl,
        tripId
    })
    const savedMessage = await (await newMessage.save())
    .populate("sender", "username profile.displayName profile.avatar")

    io.to("trip-"+tripId).emit('message', newMessage);
    console.log("New Message Emitted: " + newMessage);
    
    return res.status(201)
       .json(
            new ApiResponse(201, "Message sent successfully", newMessage)
        )
})

const getMessages = AsyncHandler(async (req, res) => {
    const tripId = req.params.tripId
    const isUserValid = await TripModel.findOne({_id: tripId, collaborator: { $in: [req.user._id]}})

    if(!isUserValid){
        throw new ApiError(400, "Unauthorized");
    }
    const messages = await MessageModel.find({ tripId })
        .populate("sender", "username profile.displayName profile.avatar")
        .sort({"createdAt": -1})
    if (!messages) throw new ApiResponse(404, "No messages found for this trip")
    return res.status(200)
       .json(
            new ApiResponse(200, "Messages fetched successfully", messages)
        )
})


export {
    sendMessage,
    getMessages
}