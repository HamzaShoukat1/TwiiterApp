import { type TokenPayload } from "../Types/types.js"
import { type CookieOptions } from "express";
import jwt from "jsonwebtoken"

export const generateAccessToken = function (payload: TokenPayload) {
    return jwt.sign(
        payload,

        process.env.ACCESS_TOKEN_SECRET || '',
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY || ''
        } as jwt.SignOptions
    )

};
export const generateRefreshToken = function (payload: TokenPayload) {
    return jwt.sign(
        payload,

        process.env.REFRESH_TOKEN_SECRET || '',
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY || ''
        } as jwt.SignOptions
    )

};


export const options:CookieOptions = {
    httpOnly: true, //prevent xss attack
    sameSite: "strict", //csrd attack
    secure: process.env.NODE_ENV !== "development" //only true in production
    
}