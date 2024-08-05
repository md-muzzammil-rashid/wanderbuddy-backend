import { Router } from "express";
import { createUser, getUserData, loginUser, logoutUser } from "../controllers/user.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route('/signup')
    .post(createUser)

router.route('/signin')
    .post(loginUser)
router.route('/signout')
    .post(verifyJWT,logoutUser)

router.route('/get-user-data')
    .get(verifyJWT, getUserData)

export default router