

import Router from "express"
import { verifyjwt } from "../Middlewares/auth.middleware.js"
import { commentonPost, createPost, deletePost, getallPost, getLikedPost, LikeUnlikePost } from "../Controllers/Post.Controller.js"
import { upload } from "../Middlewares/Multer.middleware.js"

const router = Router()


router.route("/create").post(
    verifyjwt, upload.single("postimg"), createPost)
router.route("/like/:id").post(
    verifyjwt, LikeUnlikePost)
router.route("/comment/:id").post(
    verifyjwt, commentonPost)
router.route("/:id").delete(
    verifyjwt, deletePost)
router.route("/all").get(verifyjwt, getallPost)
router.route("/likes/:id").get(verifyjwt, getLikedPost)

export default router