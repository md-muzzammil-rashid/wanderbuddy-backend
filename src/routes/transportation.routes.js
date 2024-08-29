import { Router } from "express";
import { getFlight, getTrain } from "../controllers/transportation.controllers.js";

const router = Router()

router.route("/get-flights")
    .get(getFlight)

router.route('/get-trains')
    .get(getTrain)

export default router