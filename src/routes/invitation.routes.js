import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addCollaborator, getInvitations, respondToInvitation } from "../controllers/invitation.controller.js";

const router = Router()

router.route('/add-collaborator/:tripId')
    .post(verifyJWT, addCollaborator)

router.route('/get-invitations')
    .get(verifyJWT, getInvitations)

router.route('/respond-to-invitations')
    .post(verifyJWT, respondToInvitation)

export default router