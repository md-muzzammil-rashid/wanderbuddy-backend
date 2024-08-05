import { Router } from "express";
import { getRestaurants } from "../controllers/restaurant.controller.js";


const router = Router()

router.route('/get-restaurants')
    .get(getRestaurants)


export default router;