import { Router } from "express";
import { SignUp } from "../Controllers/Auth.Controller.js";
import { upload } from "../Middlewares/Multer.middleware.js";



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



export  default router