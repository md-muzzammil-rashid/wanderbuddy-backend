import mongoose from "mongoose";
import { BudgetSchema } from "./budget.schema.js"

const TripSchema = new mongoose.Schema({
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    title: {
        type: String,
        required: true
    },
    destination: {
        type: String
    },
    destinationImage:{
        type: String
    },
    location:{
        type: String
    },
    date: {
        startDate: {
            type: Date
        },
        endDate: {
            type: Date
        },
        totalDays:{
            type: Number,
        }
    },
    placesToVisit: [{
        place: String,
        location: String,
        date: Date,
        day: Number,
        time: String,
        visited: {
            type:Boolean,
            default:false
        },
        addedBy:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        notes: [{
            type: String
        }]
    }],
    collaborator: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
}],
    budget: {
        private: [
            { type: BudgetSchema }
        ],
        public: [
            { type: BudgetSchema }
        ]
    },

})

TripSchema.pre('save', async function (next) {
    if (!this.isModified('date.startDate') || !this.isModified('date.endDate')) next();
    this.date.totalDays = Math.ceil((this.date.endDate - this.date.startDate) / (1000 * 3600 * 24)) + 1;
})

export const TripModel = mongoose.model('Trip', TripSchema)