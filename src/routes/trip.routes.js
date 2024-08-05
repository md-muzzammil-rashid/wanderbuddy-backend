import { Router } from "express";
import { addPacking, addPlace, addTrip, editPacking, getPacking, getTrip, getTrips } from "../controllers/trip.controllers.js";
import { upload } from '../middlewares/multer.middleware.js'
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router()

router.route('/add-trip')
    .post(verifyJWT, upload.single('destinationImage'),addTrip)

router.route('/get-trips')
    .get(verifyJWT, getTrips)

router.route('/get-trip/:tripId')
    .get(verifyJWT, getTrip)

router.route('/add-place/:tripId')
    .post(verifyJWT, addPlace)

router.route('/add-packing/:tripId')
    .post(verifyJWT, addPacking)

router.route('/get-packing/:tripId')
    .get(verifyJWT, getPacking)

router.route('/edit-packing/:itemId')
    .post(verifyJWT, editPacking)


export default router