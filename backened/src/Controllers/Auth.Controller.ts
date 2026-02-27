import { Apiresponse } from "../Utils/apiResponse.js";
import { Apierror } from "../Utils/apiError.js";
import crypto from "crypto"
import { asynchandler } from "../Utils/asynchandler.js";
import { USERSCHEMA } from "../Models/User.Model.js";
import { generateAccessToken, generateRefreshToken } from "../Services/Token.Service.js";
import { options } from "../Services/Token.Service.js";
import type { IUser } from "../Types/Model.Types.js";
import { generateVerificationCode } from "../Services/generateverificationcode.js";
import { sendPasswordResetEmail, sendResetSuccessEmail, sendVerificationEmail, sendWelComeEmail } from "../Services/Email/email.js";

const generateAcessandRefreshTokens = async (userId: string) => {
    try {
        //get user
        const user = await USERSCHEMA.findById(userId)
        if (!user) {
            throw new Apierror(404, "User not found");
        }
        const accessToken = generateAccessToken({
            _id: user._id.toString()
        });
        const refreshToken = generateRefreshToken({
            _id: user._id.toString()
        });
        user.refreshToken = refreshToken

        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }

    } catch (error) {
        throw new Apierror(500, "Something went wrong while generating access and refresh tokens")

    }

}

const SignUp = asynchandler(async (req, res) => {
    //get userdetails for froneted
    //validation not emtpy
    // format check
    // check user already exist
    //check for img check for avavatr
    //upload on cloudianry
    //create user obj in db
    //remvoe password and refresh token from res
    //retunr res
    const { email, username, fullName, password } = req.body

    if ([
        fullName, email, username, password
    ].some((field) => field?.trim() === "")) {
        throw new Apierror(400, "all fields are required")

    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw new Apierror(400, "invalid email format")
    }



    const exitsedUser = await USERSCHEMA.findOne({
        $or: [{ email: email.toLowerCase() }, { username: username.toLowerCase() }]
    })
    if (exitsedUser) {
        throw new Apierror(400, "user with this email or username already exist")
    }
    if (password.length < 6) {
        throw new Apierror(400, "password must be at least 6 character long")
    }
    //images
    // const files = req.files as MulterFile


    // const LocalPicturePath = files?.profileImage?.[0]?.path
    // const LocalcoverPath = files?.coverImage?.[0]?.path

    // if (!LocalPicturePath) {
    //     throw new Apierror(400, "profile picture required")
    // }

    // // upload on clouniary
    // const ProfilePic = await uploadCloudinary(LocalPicturePath)
    // if (!ProfilePic) {
    //     throw new Apierror(400, "upload profile picture is failed")
    // };

    // let coverImageUrl: { url: string, publicId: string } | undefined

    // if (LocalcoverPath) {
    //     const coverPic = await uploadCloudinary(LocalcoverPath)
    //     if (!coverPic?.url) {
    //         throw new Apierror(400, "Upload cover image failed")
    //     }
    //     coverImageUrl = { url: coverPic.url, publicId: coverPic.publicId };
    // }

    const { code, expiresAt } = generateVerificationCode()






    //create user in db
    const userData: Partial<IUser> = {
        username: username.toLowerCase(),
        fullName,
        email: email.toLowerCase(),
        password,
        // profileImage: { url: ProfilePic.url, publicId: ProfilePic.publicId },
        followers: [],
        following: [],
        bio: "",
        link: "",
        refreshToken: "",
        emailverificationToken: code,
        emailverificationTokenExpiresAt: expiresAt


    };
    // if (coverImageUrl) {
    //     userData.coverImage = { url: coverImageUrl.url, publicId: coverImageUrl.publicId };
    // }
    const user = await USERSCHEMA.create(userData)
    await sendVerificationEmail(user.email, code)



    const createUser = await USERSCHEMA.findById(user._id).select("-password -refreshToken")
    if (!createUser) {
        throw new Apierror(500, "Something wrong while register User")
    };

    return res.status(201).json(
        new Apiresponse(201, createUser, "User register successfully")
    )









})

const Signin = asynchandler(async (req, res) => {
    //get daata
    //find the user
    //password check
    //access and refresh token
    // send cookies
    const { email, password } = req.body
    if (!email || !password) {
        throw new Apierror(400, "username or password is required")

    };
    const user = await USERSCHEMA.findOne({
        email

    });
    if (!user) {
        throw new Apierror(400, "user does not exist")

    };

    if (!user.isVerified) {
        throw new Apierror(400, "Please verify your account before login");
    }

    const isPasswordValid = await user.isPasswordCorrect(password)
    if (!isPasswordValid) {
        throw new Apierror(401, "Invalid password ")

    };


    const { accessToken, refreshToken } = await generateAcessandRefreshTokens(user._id.toString())
    const logedInUser = await USERSCHEMA.findById(user._id).select("-password -refreshToken -emailverificationToken -emailverificationTokenExpiresAt")
    user.lastlogin = new Date()
    await user.save()



    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new Apiresponse(
                200,
                {
                    user: logedInUser, accessToken, refreshToken
                }
            )
        )



})
const Logout = asynchandler(async (req: any, res: any) => {
    await USERSCHEMA.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    );



    return res.status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new Apiresponse(200, {}, "user logged out")

        )


});
const getCurrentUser = asynchandler(async (req, res) => {
    return res.status(200).json(
        new Apiresponse(200, req.user, "current User fetched successfully")

    )

});
const verifyEmail = asynchandler(async (req, res) => {
    const { code } = req.body
    const user = await USERSCHEMA.findOne({
        emailverificationToken: code,
        emailverificationTokenExpiresAt: { $gt: new Date() }
    })
    if (!user) {
        throw new Apierror(400, "invalid or expired verification code")
    }

    user.isVerified = true;
    delete user.emailverificationToken;
    delete user.emailverificationTokenExpiresAt;

    await user.save()

    await sendWelComeEmail(user.email, user.username)

    return res.status(200).json(
        new Apiresponse(200, "email verified successfully")
    )



});
const forgetPassword = asynchandler(async (req, res) => {
    const { email } = req.body
    const user = await USERSCHEMA.findOne({ email })
    if (!user) {
        throw new Apierror(400, "user not found")
    }
    //generate reset tokens
    const resetTokens = crypto.randomBytes(20).toString("hex");
    const resetTokenexpiredAt = new Date(Date.now() + 1 * 60 * 60 * 1000)

    user.resetpasswordtokens = resetTokens
    user.resetpasswordExpiresAt = resetTokenexpiredAt
    await user.save()

    await sendPasswordResetEmail(user.email, `${process.env.CORS_ORIGIN}/reset-password/${resetTokens}`)

    return res.status(200).json(
        new Apiresponse(200, "Password reset link sent to your email")
    )



});
const resetPassword = asynchandler(async (req, res) => {
    const { token } = req.params
    const { password } = req.body

    const user = await USERSCHEMA.findOne({
        resetpasswordtokens: token,
        resetpasswordExpiresAt: { $gt: new Date() }
    } as any)
    if (!user) {
        throw new Apierror(400, "invalid or expired reset tokens")
    }
    user.password = password
    if (!password || password.length < 6) {
        throw new Apierror(400, "Password must be at least 6 characters");
    }
    delete user.resetpasswordtokens
    delete user.resetpasswordExpiresAt

    await user.save()
    await sendResetSuccessEmail(user.email)
    return res.status(200).json(
        new Apiresponse(200, "password reset successfully")
    )


})
export {
    SignUp,
    Signin,
    Logout,
    getCurrentUser,
    verifyEmail,
    forgetPassword,
    resetPassword
}