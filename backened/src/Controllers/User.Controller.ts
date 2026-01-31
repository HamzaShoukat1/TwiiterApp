import { USERSCHEMA } from "../Models/User.Model.js";
import { Apierror } from "../Utils/apiError.js";
import { Apiresponse } from "../Utils/apiResponse.js";
import { asynchandler } from "../Utils/asynchandler.js";
import { NOTISCHEMA } from "../Models/Notification.model.js";
import mongoose from "mongoose";
import { deleteFromCloudinary, uploadCloudinary } from "../Services/Cloudinary.js";
import {type  MulterFile } from "../Types/types.js";

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
    from: currentUser,
    to: targetUser._id,

  })
  await notification.save()
  //return id of user as res


  return res.status(200).json(
    new Apiresponse(200, {}, "User followed successfully")
  )
});



/* “Suggest random users I don’t follow yet and not myself
1. Identify ME
2. Identify who I already know (following)
3. Exclude them from search
4. Randomly suggest new people
.” */
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
  const { currentPassword, newPassword,confirmPassword } = req.body


  if (!currentPassword || !newPassword || !confirmPassword) {
    throw new Apierror(400, "Both current,new and confirm  passwords are required to change password");
  };
  if (newPassword.length < 6 || confirmPassword.length < 6) {
    throw new Apierror(400, "Password must be at least 6 characters long");
  }
 
  if(newPassword !== confirmPassword){
    throw new Apierror(400, "New and confirm passwords must match");

  }

  const user = await USERSCHEMA.findById(req.user?._id)
  if (!user) {
    throw new Apierror(404, "user not found")
  }
  const isPasswordValid = await user.isPasswordCorrect(currentPassword);
  if (!isPasswordValid) {
    throw new Apierror(401, "Invalid current password");
  }
    if (newPassword === currentPassword) {
    throw new Apierror(400, "New password must be different from current");
  }

  //update password
  user.password = newPassword



  await user.save()

  return res.status(200).json(
    new Apiresponse(200, {}, "password changed successfully")
  )

})

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


// const updateProfilePic = asynchandler(async (req, res) => {
//   const localProfilePic = req.file?.path;
  
//   if (!localProfilePic) {
//     throw new Apierror(400, "Avatar file is missing");
//   }

//   // 1️⃣ Upload new image
//   const uploadedImage = await uploadCloudinary(localProfilePic);
//   if (!uploadedImage?.url || !uploadedImage?.publicId) {
//     throw new Apierror(500, "Error while uploading profile image");
//   }

//   // 2️⃣ Get OLD publicId BEFORE update
//   const existingUser = await USERSCHEMA.findById(req.user._id).select(
//     "profileImage.publicId"
//   );

//   if (!existingUser) {
//     await deleteFromCloudinary(uploadedImage.publicId);
//     throw new Apierror(404, "User not found");
//   }

//   const oldPublicId = existingUser.profileImage?.publicId;

//   // 3️⃣ Update DB with new image
//   const user = await USERSCHEMA.findByIdAndUpdate(
//     req.user._id,
//     {
//       $set: {
//         profileImage: {
//           url: uploadedImage.url,
//           publicId: uploadedImage.publicId,
//         },
//       },
//     },
//     { new: true, runValidators: true }
//   ).select("-password -refreshToken");

//   if (!user) {
//     await deleteFromCloudinary(uploadedImage.publicId);
//     throw new Apierror(500, "Failed to update profile image");
//   }

//   // 4️⃣ Delete OLD image AFTER success
//   if (oldPublicId) {
//     await deleteFromCloudinary(oldPublicId);
//   }

//   return res.status(200).json(
//     new Apiresponse(200, user, "Profile image updated successfully")
//   );
// });

// const updateUserCoverImage = asynchandler(async (req, res) => {
//   const coverLocalPath = req.file?.path;
  
//   if (!coverLocalPath) {
//     throw new Apierror(400, "Cover image file is missing");
//   }

//   // 1️⃣ Upload new image
//   const uploadedImage = await uploadCloudinary(coverLocalPath);
//   if (!uploadedImage?.url || !uploadedImage?.publicId) {
//     throw new Apierror(500, "Error while uploading cover image");
//   }

//   // 2️⃣ Fetch OLD publicId BEFORE update
//   const existingUser = await USERSCHEMA.findById(req.user._id).select(
//     "coverImage.publicId"
//   );

//   if (!existingUser) {
//     await deleteFromCloudinary(uploadedImage.publicId);
//     throw new Apierror(404, "User not found");
//   }

//   const oldPublicId = existingUser.coverImage?.publicId;

//   // 3️⃣ Update DB
//   const user = await USERSCHEMA.findByIdAndUpdate(
//     req.user._id,
//     {
//       $set: {
//         coverImage: {
//           url: uploadedImage.url,
//           publicId: uploadedImage.publicId,
//         },
//       },
//     },
//     { new: true, runValidators: true }
//   ).select("-password -refreshToken");

//   if (!user) {
//     await deleteFromCloudinary(uploadedImage.publicId);
//     throw new Apierror(500, "Failed to update cover image");
//   }

//   // 4️⃣ Delete OLD image AFTER success
//   if (oldPublicId) {
//     await deleteFromCloudinary(oldPublicId);
//   }

//   return res.status(200).json(
//     new Apiresponse(200, user, "Cover image updated successfully")
//   );
// });
const updateProfileAndCover = asynchandler(async (req, res) => {
  // multer: upload.fields([{ name: "profileImage" }, { name: "coverImage" }])
  const files = req.files as MulterFile
  const profileFile = files?.profileImage?.[0];
  const coverFile = files?.coverImage?.[0];

  const updatedFields: any = {}; // to update DB
  const oldPublicIds: string[] = []; // to delete old images after success

  // 1️⃣ Handle profile image
  if (profileFile) {
    const uploadedProfile = await uploadCloudinary(profileFile.path);
    if (!uploadedProfile?.url || !uploadedProfile?.publicId)
      throw new Apierror(500, "Error while uploading profile image");

    const existingUser = await USERSCHEMA.findById(req.user._id).select("profileImage.publicId");
    if (!existingUser) {
      await deleteFromCloudinary(uploadedProfile.publicId);
      throw new Apierror(404, "User not found");
    }

    if (existingUser.profileImage?.publicId) oldPublicIds.push(existingUser.profileImage.publicId);

    updatedFields.profileImage = {
      url: uploadedProfile.url,
      publicId: uploadedProfile.publicId,
    };
  }

  // 2️⃣ Handle cover image
  if (coverFile) {
    const uploadedCover = await uploadCloudinary(coverFile.path);
    if (!uploadedCover?.url || !uploadedCover?.publicId)
      throw new Apierror(500, "Error while uploading cover image");

    const existingUser = await USERSCHEMA.findById(req.user._id).select("coverImage.publicId");
    if (!existingUser) {
      await deleteFromCloudinary(uploadedCover.publicId);
      throw new Apierror(404, "User not found");
    }

    if (existingUser.coverImage?.publicId) oldPublicIds.push(existingUser.coverImage.publicId);

    updatedFields.coverImage = {
      url: uploadedCover.url,
      publicId: uploadedCover.publicId,
    };
  }

  // 3️⃣ Update DB
  const user = await USERSCHEMA.findByIdAndUpdate(
    req.user._id,
    { $set: updatedFields },
    { new: true, runValidators: true }
  ).select("-password -refreshToken");

  if (!user) {
    // rollback uploads
    if (updatedFields.profileImage) await deleteFromCloudinary(updatedFields.profileImage.publicId);
    if (updatedFields.coverImage) await deleteFromCloudinary(updatedFields.coverImage.publicId);
    throw new Apierror(500, "Failed to update images");
  }

  // 4️⃣ Delete OLD images AFTER success
  for (const oldId of oldPublicIds) {
    await deleteFromCloudinary(oldId);
  }

  return res.status(200).json(
    new Apiresponse(200, user, "Profile & Cover image updated successfully")
  );
});


export {
  getUserProfile,
  followUnfollowUser,
  getSuggestedUser,
  updateCurrentPassword,
  updateAccountDetails,
  updateProfileAndCover
//   updateProfilePic,
//   updateUserCoverImage
// }
}


// $in:Field value exists in the array */
//$nin; Field value does NOT exist in the array

// MongoDB first creates a random pool of 10 sample: {size:10}

// Then you pick 4 out of that pool limit: 4

// More combinations possible
//if we wrtie sample:4 only high chance it shows same users
