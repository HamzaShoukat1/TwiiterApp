import { USERSCHEMA } from "../Models/User.Model.js"
import type { TokenPayload } from "../Types/types.js"
import { Apierror } from "../Utils/apiError.js"
import { asynchandler } from "../Utils/asynchandler.js"
import jwt from "jsonwebtoken"

export const verifyjwt = asynchandler(async (req, _res, next) => {
    //get token
    //verify token
    //extrcat user
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "")

  if (!token) {
    throw new Apierror(401, "Unauthorized request")
  }

  const decoded = jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET!
  ) as TokenPayload

  const user = await USERSCHEMA
    .findById(decoded._id)
    .select("-password -refreshToken")

  if (!user) {
    throw new Apierror(401, "Invalid access token")
  }

  req.user = user
  next()
})
