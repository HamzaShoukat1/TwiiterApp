import { POSTSCHEMA } from "../Models/Post.Model.js";
import { USERSCHEMA } from "../Models/User.Model.js";
import { deleteFromCloudinary, uploadCloudinary } from "../Services/Cloudinary.js";
import type { IPost } from "../Types/Model.Types.js";
import { Apierror } from "../Utils/apiError.js";
import { Apiresponse } from "../Utils/apiResponse.js";
import { asynchandler } from "../Utils/asynchandler.js";

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










})
const LikeUnlikePost = asynchandler(async (req, res) => {

})
const commentonPost = asynchandler(async (req, res) => {

})


export {
    createPost,
    LikeUnlikePost,
    commentonPost,
    deletePost

}