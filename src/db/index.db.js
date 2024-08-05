import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URL}/${process.env.DB_NAME}`)
            .then(console.log("Database is connected!"))
    } catch (error) {
        console.log("Database Connection Failed");
        throw Error ("Database Connection Failed")
    }
}

export {connectDB}
