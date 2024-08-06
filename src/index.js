import dotenv from "dotenv"
import { connectDB } from "./db/index.db.js"
import { startServer } from "./app.js"

dotenv.config()

startServer()