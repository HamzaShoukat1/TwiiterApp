import { Router } from "express";
import { forgetPassword, getCurrentUser, resetPassword, SignUp, verifyEmail } from "../Controllers/Auth.Controller.js";
import { upload } from "../Middlewares/Multer.middleware.js";
import { Signin } from "../Controllers/Auth.Controller.js";
import { Logout } from "../Controllers/Auth.Controller.js";
import { verifyjwt } from "../Middlewares/auth.middleware.js";


const router = Router()

router.route("/signup").post(
    upload.fields([
        {
            name: "profileImage",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }

    ]),
    SignUp)

router.route("/signin").post(Signin)
router.route("/logout").post(
    verifyjwt,
    Logout)

router.get("/currentUser", verifyjwt, getCurrentUser)
router.route("/verify-email").post(verifyEmail)
router.route("/forget-password").post(forgetPassword)
router.route("/reset-password/:token").post(resetPassword)



export default router