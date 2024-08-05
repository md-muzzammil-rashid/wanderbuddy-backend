import mongoose from "mongoose";


const InvitationSchema = new mongoose.Schema({
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    receiverId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    status:{
        type:String,
        enum:['Pending', 'Accepted', 'Rejected'],
        default:'Pending'
    },
    tripId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Trip'
    }
})

export const InvitationModel = mongoose.model('Invitation', InvitationSchema)