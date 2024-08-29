import { Router } from "express";
import { getTopAttraction } from "../controllers/places.controllers.js";

const router = Router()

router.route("/get-top-attractions")
    .get(getTopAttraction)

export default router