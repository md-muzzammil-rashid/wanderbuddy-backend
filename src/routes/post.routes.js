import { Router } from "express";
import { addComment, addPost, getAllPosts, getComments, likePost, postDetails } from "../controllers/post.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from '../middlewares/multer.middleware.js'

const router = Router();

router.route('/add')
    .post(verifyJWT, upload.single('postImage'), addPost)

router.route("/all-posts")
    .get(verifyJWT, getAllPosts)

router.route('/like-post')
    .post(verifyJWT, likePost)

router.route('/get-post')
    .get(verifyJWT, postDetails)

router.route("/get-comments")
    .get(verifyJWT, getComments)

router.route("/add-comment")
    .post(verifyJWT, addComment)


export default router