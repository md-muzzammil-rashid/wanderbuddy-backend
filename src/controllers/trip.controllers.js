import ApiResponse from '../utils/ApiResponse.utils.js';
import AsyncHandler from '../utils/AsyncHandler.utils.js'
import { TripModel } from '../models/trip.model.js'
import uploadOnCloudinary from '../utils/Cloudinary.utils.js'
import { response } from 'express';
import ApiError from '../utils/ApiError.utils.js';
import { UserModel } from '../models/user.model.js';
import { InvitationModel } from '../models/invitation.model.js';
import { PackingModel } from '../models/packing.model.js';

const addTrip = AsyncHandler(async (req, res, next) => {
    console.log('ctrl in addTrip');
    const {title, startDate, endDate, destination, location} = req.body

    const destinationImage = await uploadOnCloudinary(req.file.path)

    const newTrip = await TripModel.create({
        admin: req.user._id,
        title,
        destination,
        destinationImage:destinationImage.url,
        location,
        collaborator:[req.user._id],
        date:{
            startDate,
            endDate,
        }
    })

    if(!newTrip){
        throw new ApiError(400, "Trip could not be added")
    }

    return res.status(200)
        .json(
            new ApiResponse(202, "Trip added successfully", newTrip)
        )
})

const getTrips = AsyncHandler(async (req, res, next) => {
    const trips = await TripModel.find({$or:[
        {admin:req.user._id},
        {collaborator: {$in: [req.user._id]}}
    ]})
    .populate({
        path:'collaborator',
        select:'profile.displayName '
    })

    if(trips.length == 0){
        return res.status(200)
            .json(
                new ApiResponse(404, "No trips found", trips)
            )
    }

    return res.status(200)
       .json(
            new ApiResponse(200, "Trips fetched successfully", trips)
        )
})

const getTrip = AsyncHandler(async (req, res, next) => {
    const {tripId} = req.params
    const tripDetail = await TripModel.findOne({
        _id:tripId,
        $or:[
            {admin:req.user._id},
            {collaborator: {$in: [req.user._id]}}
        ]
    })
    .populate({
        path:'collaborator',
        select:'profile.displayName profile.avatar'
    })
    if(!tripDetail){
        throw new ApiError(404, "Trip Not Found")
    }

    return res.status(200)
        .json(
            new ApiResponse(200, "Trip fetched successfully", tripDetail)
        )
})

const addPlace = AsyncHandler(async (req, res, next) => {
    const user = await UserModel.findById(req.user._id);
    if(!user){
        throw new ApiError(404, "User not found")
    }
    const trip = await TripModel.findById(req.params.tripId);
    if(!trip){
        throw new ApiError(404, "Trip not found")
    }
    const {place, location, time, notes} = req.body
    console.log(req.body);
    const day = JSON.parse(req.body.day)
    const newPlace = trip.placesToVisit.push({
        place,
        location,
        date:day.date,
        day :day.day,
        time,
        notes,
        addedBy:req.user._id
    })
    const savedData = await trip.save({validateBeforeSave:false})

    if(savedData){

        return res.status(200)
        .json(
            new ApiResponse(200, "Place added successfully", savedData)
        )
    }
})

const addPacking = AsyncHandler(async (req, res)=>{
    const {packingItem} = req.body
    const {tripId} = req.params
    const trip = await TripModel.findById(tripId);
    if(!trip){
        throw new ApiError(404, "Trip not found")
    }
    const packingAlreadyPresent = await PackingModel.findOne({
        userId: req.user._id,
        tripId: trip._id,
        "packingItems.itemName":packingItem.itemName
    })
    if(packingAlreadyPresent){
        packingAlreadyPresent.packingItems = packingItem;
        await packingAlreadyPresent.save()
        return res.status(200)
        .json(
            new ApiResponse(200, "Packing already present", packingAlreadyPresent)
        )
    }

    const packing = await PackingModel.create({
        userId: req.user._id,
        tripId: trip._id,
        packingItems:packingItem
    })

    if(!packing){
        throw new ApiError(400, "Packing could not be added")
    }
    
    return res.status(200)
        .json(
            new ApiResponse(202, "Packing added successfully", packing)
        )
})

const getPacking = AsyncHandler(async (req, res)=> {
    const {tripId} = req.params
    const trip = await TripModel.findById(tripId);
    if(!trip){
        throw new ApiError(404, "Trip not found")
    }
    const packings = await PackingModel.aggregate(
        [
          {
            $match: {
              userId:req.user._id,
              tripId:trip._id,
            }
          },
          {
         $group: {
              _id: { userId: "$userId", itemId: "$_id", itemName: "$packingItems.itemName", checked:"$packingItems.checked" },
              totalQuantity: { $sum: "$packingItems.quantity" }
            }
          },
          {
                $group: {
              _id: "$_id.userId",
              items: {
                $push: {
                  itemName: "$_id.itemName",
                  quantity: "$totalQuantity",
                  itemId:"$_id.itemId",
                  checked:"$_id.checked"
                }
              }
            }
          }
        ])

        return res.status(200)
            .json(
                new ApiResponse(200, "Item fetched successfully", packings[0])
            )
})

const editPacking = AsyncHandler(async (req, res) => {
    const {packingItem} = req.body
    const {itemId} = req.params;
    const packing = await PackingModel.findOne({
        _id: itemId,
        userId: req.user._id,
    })

    if(!packing){
        throw new ApiError(404, "Packing not found")
    }
    packing.packingItems = packingItem;
    await packing.save()
    return res.status(200)
        .json(
            new ApiResponse(200, "Packing updated successfully", packing)
        )
})

export {
    addTrip,
    getTrips,
    getTrip,
    addPlace,
    addPacking,
    getPacking,
    editPacking

}