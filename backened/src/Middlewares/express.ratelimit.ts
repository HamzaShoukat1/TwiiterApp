import rateLimit from "express-rate-limit";

export const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per window
    message: {
        status: 429,
        success: false,
        message: "Too many requests, please try again later."
    },
    standardHeaders: true, // Return rate limit info in headers
    legacyHeaders: false,  // Disable old headers
});