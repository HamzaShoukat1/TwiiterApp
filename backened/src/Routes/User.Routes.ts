
import { Router } from "express";
import { verifyjwt } from "../Middlewares/auth.middleware.js";
import { followUnfollowUser, getSuggestedUser, getUserProfile } from "../Controllers/User.Controller.js";
import { updateAccountDetails,updateProfilePic,updateUserCoverImage,updateCurrentPassword } from "../Controllers/User.Controller.js";
import { upload } from "../Middlewares/Multer.middleware.js";
const router = Router()


router.get("/profile/:username", verifyjwt, getUserProfile)
router.route("/follow/:id").post(verifyjwt, followUnfollowUser)
router.get("/suggested",verifyjwt, getSuggestedUser)


//for profile updatiing
router.patch("/password", verifyjwt, updateCurrentPassword);
router.patch("/account", verifyjwt, updateAccountDetails);
router.patch("/profile-image", verifyjwt, upload.single("profileImage"), updateProfilePic);
router.patch("/cover-image", verifyjwt, upload.single("coverImage"), updateUserCoverImage);





export default router
