import { asynchandler } from "../Utils/asynchandler.js";
import { Apiresponse } from "../Utils/apiResponse.js";
import { NOTISCHEMA } from "../Models/Notification.model.js";
import { Apierror } from "../Utils/apiError.js";


const getNotifications = asynchandler(async (req, res) => {
    const userId = req.user._id
    console.log("USER ID:", userId);
    const all = await NOTISCHEMA.find();
    console.log("ALL NOTIS:", all);

    //🔹 Mark notifications as read
    await NOTISCHEMA.updateMany({ to: userId, read: false }, { read: true }) //update(filter,update)

    return res.status(200).json(
        new Apiresponse(200, all, "noti send successfully")
    )



});
const deleteNotifications = asynchandler(async (req, res) => {
    const userId = req.user._id
    await NOTISCHEMA.deleteMany({ to: userId })
    return res.status(200).json(
        new Apiresponse(200, {}, "noti deleted successfully")
    )
});
const deleteSingleNotification = asynchandler(async (req, res) => {
    const notificationId = req.params.id
    const userId = req.user._id

    const notification = await NOTISCHEMA.findById(notificationId)
    if (!notification) {
        throw new Apierror(404, "notification not found")
    };

    if (notification.to.toString() !== userId.toString()) {
        throw new Apierror(404, "You are not allowed to delete this noti")


    }
    await NOTISCHEMA.findByIdAndDelete(notification)
    return res.status(200).json(
        new Apiresponse(200, {}, "Noti deleted successfully")
    )









})


export {
    getNotifications,
    deleteNotifications,
    deleteSingleNotification
}