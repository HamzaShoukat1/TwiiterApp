import { Router } from "express";
import { verifyjwt } from "../Middlewares/auth.middleware.js";
import { deleteNotifications, getNotifications } from "../Controllers/Noti.Controller.js";

const router = Router()

router.route("/").get(verifyjwt,getNotifications)

router.delete('/', verifyjwt, deleteNotifications);

// router.route("/:id").delete(verifyjwt,deleteSingleNotification)






export default router