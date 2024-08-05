import mongoose from "mongoose";

export const BudgetSchema = new mongoose.Schema({
    category:{
        enum:['Transportation, Accommodation', 'Meals and Dining', 'Activity and Entertainment','Miscellaneous','Emergency Funds','Shopping']
    },
    budgetName:{
        type:String
    },
    amount:{
        type:Number
    },
    budgetType:{
        enum:['private','public']
    }

})