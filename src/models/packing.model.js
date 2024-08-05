import mongoose from "mongoose";

export const PackingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    packingItems:{
        itemName:{
            type:String
        },
        quantity:{
            type:Number
        },
        checked:{
            type:Boolean,
            default:false
        }
    },
    tripId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Trip'
    }
})

export const PackingModel = mongoose.model('Packings', PackingSchema )