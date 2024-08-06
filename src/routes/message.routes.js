import { Router } from "express";
import { getMessages, sendMessage } from "../controllers/message.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/send-message/:tripId")
    .post(verifyJWT, sendMessage)

router.route("/get-messages/:tripId")
    .get(verifyJWT, getMessages)




export default router;
