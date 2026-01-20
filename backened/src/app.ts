import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import AuthRoutes from "./Routes/AuthRoutes.js"
import path from "node:path"
import UserRoutes from "./Routes/User.Routes.js"
import PostRoutes from "./Routes/Post.Routes.js"
import NotificationRoutes from "./Routes/Notification.Routes.js"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({ limit: "20kb" })) //to parse req.body
app.use(express.urlencoded({ extended: true, limit: "20kb" }))
// app.use(express.static("pub"))
app.use("assets",express.static(path.join(process.cwd(), "backened/Public/assets")))
app.use(cookieParser())

//auth routes
app.use("/api/v1/auth",AuthRoutes)


//user routes
app.use("/api/v1/user",UserRoutes)
app.use("/api/v1/post",PostRoutes)
app.use("/api/v1/notification",NotificationRoutes)


export { app }

