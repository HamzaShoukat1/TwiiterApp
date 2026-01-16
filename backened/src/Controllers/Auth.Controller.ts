import { Apiresponse } from "../Utils/apiResponse.js";
import { Apierror } from "../Utils/apiError.js";
import { asynchandler } from "../Utils/asynchandler.js";
import { USERSCHEMA } from "../Models/User.Model.js";
import type { MulterFile } from "../Types/types.js";
import { uploadCloudinary } from "../Services/Cloudinary.js";
import { generateAccessToken, generateRefreshToken } from "../Services/Token.Service.js";
import { options } from "../Services/Token.Service.js";
import type { IUser } from "../Types/Model.Types.js";

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
        $or: [{ email }, { username }]
    })
    if (exitsedUser) {
        throw new Apierror(400, "user with this email or username already exist")
    }
    if (password.length < 6) {
        throw new Apierror(400, "password must be at least 6 character long")
    }
    //images
    const files = req.files as MulterFile


    const LocalPicturePath = files?.profileImage?.[0]?.path
    const LocalcoverPath = files?.coverImage?.[0]?.path

    if (!LocalPicturePath) {
        throw new Apierror(400, "profile picture required")
    }

    // upload on clouniary
    const ProfilePic = await uploadCloudinary(LocalPicturePath)
    if (!ProfilePic) {
        throw new Apierror(400, "upload profile picture is failed")
    };

    let coverImageUrl: { url: string, publicId: string } | undefined

    if (LocalcoverPath) {
        const coverPic = await uploadCloudinary(LocalcoverPath)
        if (!coverPic?.url) {
            throw new Apierror(400, "Upload cover image failed")
        }
        coverImageUrl = { url: coverPic.url, publicId: coverPic.publicId };
    }







    //create user in db
    const userData: Partial<IUser> = {
        username,
        fullName,
        email,
        password,
        profileImage: { url: ProfilePic.url, publicId: ProfilePic.publicId },
        followers: [],
        following: [],
        bio: "",
        link: "",
        refreshToken: ""
    };
    if (coverImageUrl) {
        userData.coverImage = { url: coverImageUrl.url, publicId: coverImageUrl.publicId };
    }
    const user = await USERSCHEMA.create(userData)


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
        $or: [{ email }]

    });
    if (!user) {
        throw new Apierror(400, "user does not exist")

    };
    const isPasswordValid = await user.isPasswordCorrect(password)
    if (!isPasswordValid) {
        throw new Apierror(401, "Invalid password ")

    };

    const { accessToken, refreshToken } = await generateAcessandRefreshTokens(user._id.toString())
    const logedInUser = await USERSCHEMA.findById(user._id).select("-password -refreshToken")


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
const Logout = asynchandler(async (req, res) => {
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
export {
    SignUp,
    Signin,
    Logout,
    getCurrentUser,
}