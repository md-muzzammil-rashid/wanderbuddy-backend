import { InvitationModel } from "../models/invitation.model.js";
import { TripModel } from "../models/trip.model.js";
import { UserModel } from "../models/user.model.js";
import ApiError from "../utils/ApiError.utils.js";
import ApiResponse from "../utils/ApiResponse.utils.js";
import AsyncHandler from "../utils/AsyncHandler.utils.js";


const addCollaborator = AsyncHandler(async (req, res, next) => {
    const { username } = req.body
    const { tripId } = req.params
    const tripDetail = await TripModel.findOne({
        _id: tripId,
        $or: [
            { admin: req.user._id },
            { collaborator: { $in: [req.user._id] } }
        ]
    })
    if (!tripDetail) {
        throw new ApiError(404, "Trip Not Found")
    }

    const receiver = await UserModel.findOne({ username: username.trim().toLowerCase() })

    if (!receiver) {
        return res.status(200)
            .json(
                new ApiResponse(404, "User not found", {})
            )
    }
    console.log(tripId);
    console.log(receiver._id);
    const isAlreadyPresent = await TripModel.findOne({
        _id: tripDetail._id,
        $or: [
            { admin: receiver._id },
            { collaborator: { $in: [receiver._id] } }
        ]
    })
    if (isAlreadyPresent) {
        return res.status(200)
            .json(
                new ApiResponse(200, "User already present", {})
            )
    }

    const isInvitationAlreadySend = await InvitationModel.findOne({
        tripId: tripId,
        senderId: req.user._id,
        receiverId: receiver._id,
        status: 'Pending'
    })
    console.log("invited: ", isInvitationAlreadySend);
    if (isInvitationAlreadySend) {
        return res.status (200)
            .json(
                new ApiResponse(200, "Invitation already sent", {})
            )
    }


    const invitation = await InvitationModel.create({
        senderId: req.user._id,
        receiverId: receiver._id,
        tripId: tripId
    })

    console.log(invitation);

    if (!invitation) {
        throw new ApiError(400, "Invitation could not be sent")
    }

    return res.status(200)
        .json(
            new ApiResponse(202, "Invitation sent successfully", invitation)
        )

})

const getInvitations = AsyncHandler(async (req, res, next) => {
    const user = await UserModel.findById(req.user._id)

    if (!user) {
        throw new ApiError(404, "User not found")
    }
    const invitations = await InvitationModel.find({ receiverId: user._id, status: 'Pending' })
        .populate({
            path: 'senderId',
            select: 'profile.displayName'
        })
        .populate({
            path: 'tripId',
            select: 'title destinationImage'
        })

    if (!invitations) {
        throw new ApiError(404, "No invitations found")
    }

    return res.status(200)
        .json(
            new ApiResponse(200, "Invitations fetched successfully", invitations)
        )


})

const respondToInvitation = AsyncHandler(async (req, res, next) => {
    const { invitationId, response } = req.body
    console.log(invitationId, response);
    const invitations = await InvitationModel.find({
        receiverId: req.user._id,
        _id: invitationId
    })
    if (!invitations) {
        throw new ApiError(404, "Invitation not found")
    }
    let trip;
    let i = 0;
    console.log(invitations);
    if (response === 'Accepted') {
        trip = await TripModel.findByIdAndUpdate(invitations[0].tripId, {
            $push: {
                collaborator: req.user._id
            }
        })
        for (let invitation of invitations) {
            console.log(++i);
            invitation.status = 'Accepted'
            await invitation.save();
        }

    } else if (response === 'Rejected') {
        for (let invitation of invitations) {
            invitation.status = 'Rejected'
            await invitation.save();
        }

    }


    return res.status(200)
        .json(
            new ApiResponse(200, "Invitation responded successfully", { trip })
        )

})

export {
    addCollaborator,
    getInvitations,
    respondToInvitation
}