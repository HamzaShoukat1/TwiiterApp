
import { POSTSCHEMA } from "../Models/Post.Model.js";
import { USERSCHEMA } from "../Models/User.Model.js";
import { deleteFromCloudinary, uploadCloudinary } from "../Services/Cloudinary.js";
import type { IPost } from "../Types/Model.Types.js";
import { Apierror } from "../Utils/apiError.js";
import { Apiresponse } from "../Utils/apiResponse.js";
import { asynchandler } from "../Utils/asynchandler.js";
import { NOTISCHEMA } from "../Models/Notification.model.js";

const createPost = asynchandler(async (req, res) => {
    const { text } = req.body;
    const file = req.file; // multer single file
    let postimg: { url: string; publicId: string } | undefined;

    if (!text && !file) {
        throw new Apierror(400, "Post must have text or image");
    }

    const userId = req.user._id;
    const user = await USERSCHEMA.findById(userId);
    if (!user) {
        throw new Apierror(404, "User not found");
    }

    if (file) {
        const uploadResponse = await uploadCloudinary(file.path);
        if (!uploadResponse?.url || !uploadResponse?.publicId) {
            throw new Apierror(500, "Failed to upload post image");
        }
        postimg = {
            url: uploadResponse.url,
            publicId: uploadResponse.publicId,
        };
    }


    const postData: Partial<IPost> = {
        user: userId,
        text,
    }
    if (postimg) postData.postimg = postimg
    const newPost = await POSTSCHEMA.create(postData);


    return res.status(201).json(
        new Apiresponse(201, newPost, "Post created successfully")
    );
});
const deletePost = asynchandler(async (req, res) => {
    const user = req.params.id

    const post = await POSTSCHEMA.findById(user)
    if (!post) {
        throw new Apierror(400, "post not found")
    }

    if (post.user.toString() !== req.user._id.toString()) {
        throw new Apierror(403, "you are not authoirzed to delete this post")


    }
    //del img for coudinary
    if (post.postimg?.publicId) {
        await deleteFromCloudinary(post.postimg.publicId)
    }

    //delt post from  from db
    await POSTSCHEMA.findByIdAndDelete(user)

    return res.status(200).json(
        new Apiresponse(200, {}, "Post deleted successfully")
    );










});
const commentonPost = asynchandler(async (req, res) => {
    const { text } = req.body
    const postId = req.params.id
    const userId = req.user._id

    if (!text) {
        throw new Apierror(400, "user field is required")
    }

    const post = await POSTSCHEMA.findByIdAndUpdate(
        postId,
        {
            $push: {
                comments: {
                    user: userId,
                    text,
                    createdAt: new Date()
                }
            }
        },
        { new: true }

    );
    if (!post) {
        throw new Apierror(400, "post not found")
    }

    const newComment = post.comments[post.comments.length - 1]
    return res.status(200).json(
        new Apiresponse(200, newComment, " Comment add successfully")
    )









})
const LikeUnlikePost = asynchandler(async (req, res) => {
    const userId = req.user._id
    const { id: postId } = req.params

    const post = await POSTSCHEMA.findById(postId)

    if (!post) {
        throw new Apierror(404, "post not found")
    }

    // const isLikedByUser = post.likes.includes(userId)
    const alreadyLiked = post.likes.some(
        (id) => id.toString() === userId.toString()
    );

    if (alreadyLiked) {
        //unike
        await POSTSCHEMA.findByIdAndUpdate(
            postId,
            {
                $pull: {
                    likes: userId,
                }
            }
        );
        await USERSCHEMA.findByIdAndUpdate(
            userId,
            {
                $pull: {
                    likedPost: postId

                }
            }
        )

        return res.status(200).json(
            new Apiresponse(201, {}, "post unliked successfully")
        )


    } else {
        //like
        await POSTSCHEMA.findByIdAndUpdate(
            postId,
            {
                $addToSet: {
                    likes: userId
                }
            }
        );
        // add in likes post also after like
        await USERSCHEMA.findByIdAndUpdate(
            userId,
            {
                $addToSet: {
                    likedPost: postId

                }
            }
        )




        if (post.user.toString() !== userId.toString()) {
            await NOTISCHEMA.create({
                from: userId,
                to: post.user,
                type: "like"
            })

        }


        return res.status(200).json(
            new Apiresponse(201, {}, "post liked successfully")
        )
    }





});
const getallPost = asynchandler(async (req, res) => {
    const posts = await POSTSCHEMA.find().sort({ createdAt: -1 }).populate({
        path: "user",
        select: "-password -refreshToken"
    })
        .populate({
            path: "comments.user",
            select: "-password -refreshToken"
        })

    if (posts.length === 0) {
        return res.status(200).json(
            new Apiresponse(200, [], "no post")
        )
    }
    const totalPosts = await POSTSCHEMA.countDocuments()
    return res.status(200).json(
        new Apiresponse(200, { posts, totalPosts }, " posts fetched successfully")
    )

})
const getLikedPost = asynchandler(async (req, res) => {
    const userId = req.params.id
    const user = await USERSCHEMA.findById(userId)
    if (!user) {
        throw new Apierror(404, "user not found")
    }
    const likedPosts = await POSTSCHEMA.find({ _id: { $in: user.likedPost } }).populate({
        path: "user",
        select: "-password -refreshToken"
    }).populate({
        path: "comments.user",
        select: "-password -refreshToken"
    })

    return res.status(200).json(
        new Apiresponse(200, likedPosts, "likes post fetched successfully")
    )
})




export {
    createPost,
    LikeUnlikePost,
    commentonPost,
    deletePost,
    getallPost,
    getLikedPost

}




//History / logs / repeated actions → $push

//Unique lists / sets → $addToSet