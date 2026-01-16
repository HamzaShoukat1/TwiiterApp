import { USERSCHEMA } from "../Models/User.Model.js";
import { Apierror } from "../Utils/apiError.js";
import { Apiresponse } from "../Utils/apiResponse.js";
import { asynchandler } from "../Utils/asynchandler.js";
import { NOTISCHEMA } from "../Models/Notification.model.js";
import mongoose from "mongoose";
import { deleteFromCloudinary, uploadCloudinary } from "../Services/Cloudinary.js";

const getUserProfile = asynchandler(async (req, res) => {
  const { username } = req.params

  if (!username) {
    throw new Apierror(401, "username is required")
  };

  const user = await USERSCHEMA.findOne({ username }).select("-password -refreshToken")
  if (!user) {
    throw new Apierror(404, "user  not found")
  }
  return res.status(200).json(
    new Apiresponse(200, user, "user Profile fetched successfully")
  )



});

const followUnfollowUser = asynchandler(async (req, res) => {
  const targetUserId = req.params.id
  const currentUserId = req.user._id.toString() /* the one wo peroforming action */

  // 1️⃣ Cannot follow yourself
  if (targetUserId === currentUserId) {
    throw new Apierror(400, "You cannot follow or unfollow yourself")
  }

  // 2️⃣fetch both users
  const [targetUser, currentUser] = await Promise.all([
    USERSCHEMA.findById(targetUserId),
    USERSCHEMA.findById(currentUserId)
  ])

  //check user exots
  if (!targetUser || !currentUser) {
    throw new Apierror(404, "User not found")
  }

  // 3️⃣ Check follow state
  const isFollowing = currentUser.following.includes(targetUser._id)

  if (isFollowing) {
    // 🔁 UNFOLLOW
    await Promise.all([
      USERSCHEMA.findByIdAndUpdate(targetUserId, {
        $pull: { followers: currentUserId }
      }),
      USERSCHEMA.findByIdAndUpdate(currentUserId, {
        $pull: { following: targetUserId }
      })
    ])
    //return id of user as res
    return res.status(200).json(
      new Apiresponse(200, {}, "User unfollowed successfully")
    )
  }

  // ➕ FOLLOW
  await Promise.all([
    USERSCHEMA.findByIdAndUpdate(targetUserId, {
      $addToSet: { followers: currentUserId }
    }),
    USERSCHEMA.findByIdAndUpdate(currentUserId, {
      $addToSet: { following: targetUserId }
    })
  ])
  //send noti to usr
  const notification = new NOTISCHEMA({
    type: "follow",
    from: req.user._id,
    to: targetUser._id,

  })
  await notification.save()
  //return id of user as res


  return res.status(200).json(
    new Apiresponse(200, {}, "User followed successfully")
  )
});

const getSuggestedUser = asynchandler(async (req, res) => {
  const userId = req.user._id.toString();

  // 1️⃣ Get the list of users I'm following
  const currentUser = await USERSCHEMA.findById(userId).select("following");
  const followingIds = currentUser?.following.map((id) => id.toString()) || [];

  // 2️⃣ Get random users excluding myself and users I'm already following
  const suggestedUsers = await USERSCHEMA.aggregate([
    {
      $match: {
        _id: { $nin: [new mongoose.Types.ObjectId(userId), ...followingIds.map(id => new mongoose.Types.ObjectId(id))] }, /* $nin → exclude these IDs from results */
      },
    },
    {
      $sample: { size: 10 }, // get 10 random users
    },
    {
      $project: {
        password: 0,       // exclude password
        refreshToken: 0,   // exclude refreshToken
        email: 0           // optionally exclude email for privacy
      }
    },
    {
      $limit: 4 // final limit of suggested users
    }
  ]);

  return res.status(200).json(
    new Apiresponse(200, suggestedUsers, "Suggested users fetched successfully")
  );
});

const updateCurrentPassword = asynchandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body


  if (!currentPassword || !newPassword) {
    throw new Apierror(400, "Both current and new password are required");
  };
  if (newPassword.length < 6) {
    throw new Apierror(400, "Password must be at least 6 characters long");
  }
  if (newPassword === currentPassword) {
    throw new Apierror(400, "choose different password ")
  }

  const user = await USERSCHEMA.findById(req.user?._id)
  if (!user) {
    throw new Apierror(400, "user not found")
  }
  const isPasswordValid = await user.isPasswordCorrect(currentPassword);
  if (!isPasswordValid) {
    throw new Apierror(401, "Invalid current password");
  }

  //update password
  user.password = newPassword



  await user.save()

  return res.status(200).json(
    new Apiresponse(200, {}, "password changed successfully")
  )

})
/* const updateUserProfile = asynchandler(async (req, res) => {

  const { fullName, username, email, cuurenPassword, newPassword, bii, link } = req.body


}) */
 const updateAccountDetails = asynchandler(async (req, res) => {
  const { username, fullName, email, bio, link } = req.body;

  // Build the update object dynamically
  const updateFields: any = {};
  if (username) updateFields.username = username;
  if (fullName) updateFields.fullName = fullName;
  if (email) updateFields.email = email;
  if (bio) updateFields.bio = bio;
  if (link) updateFields.link = link;

  // If nothing is provided
  if (Object.keys(updateFields).length === 0) {
    throw new Apierror(400, "At least one field is required to update");
  }

  const user = await USERSCHEMA.findByIdAndUpdate(
    req.user._id,
    { $set: updateFields },
    { new: true, runValidators: true }
  ).select("-password -refreshToken");

  if (!user) throw new Apierror(404, "User not found");

  return res.status(200).json(
    new Apiresponse(200, user, "Account details updated successfully")
  );
});


const updateProfilePic = asynchandler(async (req, res) => {
  const localProfilePic = req.file?.path;
  if (!localProfilePic) {
    throw new Apierror(400, "Avatar file is missing");
  }

  // 1️⃣ Upload new image
  const uploadedImage = await uploadCloudinary(localProfilePic);
  if (!uploadedImage?.url || !uploadedImage?.publicId) {
    throw new Apierror(500, "Error while uploading profile image");
  }

  // 2️⃣ Get OLD publicId BEFORE update
  const existingUser = await USERSCHEMA.findById(req.user._id).select(
    "profileImage.publicId"
  );

  if (!existingUser) {
    await deleteFromCloudinary(uploadedImage.publicId);
    throw new Apierror(404, "User not found");
  }

  const oldPublicId = existingUser.profileImage?.publicId;

  // 3️⃣ Update DB with new image
  const user = await USERSCHEMA.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        profileImage: {
          url: uploadedImage.url,
          publicId: uploadedImage.publicId,
        },
      },
    },
    { new: true, runValidators: true }
  ).select("-password -refreshToken");

  if (!user) {
    await deleteFromCloudinary(uploadedImage.publicId);
    throw new Apierror(500, "Failed to update profile image");
  }

  // 4️⃣ Delete OLD image AFTER success
  if (oldPublicId) {
    await deleteFromCloudinary(oldPublicId);
  }

  return res.status(200).json(
    new Apiresponse(200, user, "Profile image updated successfully")
  );
});

const updateUserCoverImage = asynchandler(async (req, res) => {
  const coverLocalPath = req.file?.path;
  if (!coverLocalPath) {
    throw new Apierror(400, "Cover image file is missing");
  }

  // 1️⃣ Upload new image
  const uploadedImage = await uploadCloudinary(coverLocalPath);
  if (!uploadedImage?.url || !uploadedImage?.publicId) {
    throw new Apierror(500, "Error while uploading cover image");
  }

  // 2️⃣ Fetch OLD publicId BEFORE update
  const existingUser = await USERSCHEMA.findById(req.user._id).select(
    "coverImage.publicId"
  );

  if (!existingUser) {
    await deleteFromCloudinary(uploadedImage.publicId);
    throw new Apierror(404, "User not found");
  }

  const oldPublicId = existingUser.coverImage?.publicId;

  // 3️⃣ Update DB
  const user = await USERSCHEMA.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        coverImage: {
          url: uploadedImage.url,
          publicId: uploadedImage.publicId,
        },
      },
    },
    { new: true, runValidators: true }
  ).select("-password -refreshToken");

  if (!user) {
    await deleteFromCloudinary(uploadedImage.publicId);
    throw new Apierror(500, "Failed to update cover image");
  }

  // 4️⃣ Delete OLD image AFTER success
  if (oldPublicId) {
    await deleteFromCloudinary(oldPublicId);
  }

  return res.status(200).json(
    new Apiresponse(200, user, "Cover image updated successfully")
  );
});


export {
  getUserProfile,
  followUnfollowUser,
  getSuggestedUser,
  // updateUserProfile,
  updateCurrentPassword,
  updateAccountDetails,
  updateProfilePic,
  updateUserCoverImage
}



// $in:Field value exists in the array */
//$nin; Field value does NOT exist in the array