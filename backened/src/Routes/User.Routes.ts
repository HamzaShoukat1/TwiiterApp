
import { Router } from "express";
import { verifyjwt } from "../Middlewares/auth.middleware.js";
import { followUnfollowUser, getSuggestedUser, getUserProfile } from "../Controllers/User.Controller.js";
import { updateAccountDetails, updateProfileAndCover, updateCurrentPassword } from "../Controllers/User.Controller.js";
import { upload } from "../Middlewares/Multer.middleware.js";
const router = Router()


router.get("/profile/:username", verifyjwt, getUserProfile)
router.route("/follow/:id").post(verifyjwt, followUnfollowUser)
router.get("/suggested", verifyjwt, getSuggestedUser)


//for profile updatiing
router.patch("/change-password", verifyjwt, updateCurrentPassword);
router.patch("/account", verifyjwt, updateAccountDetails);
router.patch("/update-profile", verifyjwt,
    upload.fields([
        {
            name: "profileImage",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1


        }
    ])
    , updateProfileAndCover);
// router.patch("/cover-image", verifyjwt, upload.single("coverImage"), updateUserCoverImage);





export default router
