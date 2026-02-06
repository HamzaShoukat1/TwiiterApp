import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "node:path";
import AuthRoutes from "./Routes/AuthRoutes.js";
import UserRoutes from "./Routes/User.Routes.js";
import PostRoutes from "./Routes/Post.Routes.js";
import NotificationRoutes from "./Routes/Notification.Routes.js";
import { errorHandler } from "./Middlewares/error.middleware.js";
// import dotenv from "dotenv";
// dotenv.config({ path: "./backened/.env" }); // make sure path is correct

const app = express();

// Middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "20kb" }));

// Serve assets properly
app.use("/assets", express.static(path.join(process.cwd(), "backened", "Public", "assets")));
app.use(cookieParser());

// API routes
app.use("/api/v1/auth", AuthRoutes);
app.use("/api/v1/user", UserRoutes);
app.use("/api/v1/post", PostRoutes);
app.use("/api/v1/notification", NotificationRoutes);

// Error handler

// Production frontend
// if (process.env.NODE_ENV === "production") {
//     const frontendPath = path.join(process.cwd(), "fronted", "dist");
//     app.use(express.static(frontendPath));
    

// app.get(/.*/, (_req, res) => {
//     res.sendFile(path.join(frontendPath, "index.html"));
// });

// }
app.use(errorHandler);

export { app };
