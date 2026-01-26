import { FaRegComment, FaRegHeart } from "react-icons/fa";

import { BiRepost } from "react-icons/bi";
import { useState } from "react";
import { UseCommentPost, useLikesAndUnlike } from "../../../mutationsAndQueries.tsx";
import LoadingSpinner from "../../LoadingSpinner";


export default function PostStates({ currentUserId, post }: { currentUserId?: string, post: any }) {
    const [likes, setLikes] = useState(post.likes); // start with initial likes
    // const likes = post.likes;
    const [comment, setComment] = useState("");
    const isLiked = currentUserId ? likes.includes(currentUserId) : false



    const { LikedPost, isLiking } = useLikesAndUnlike({
        post,
        onSuccess: (updatedLikes) => setLikes(updatedLikes)

    });
    const { CommentPost, isCommenting } = UseCommentPost()

    const handlePostComment = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!comment.trim() || isCommenting) return;
        CommentPost({
            postId: post._id,
            text: comment
        });
        setComment("")

    };

    const handleLikePost = () => {
        if (isLiking) return
        LikedPost()
    };

    const openCommentsModal = () => {
        const modal = document.getElementById(
            `comments_modal_${post._id}`
        ) as HTMLDialogElement | null;

        modal?.showModal();
    };
    return (
        <>
            {/* Comments */}
            <div
                className="flex gap-1 items-center cursor-pointer group"
                onClick={openCommentsModal}
            >
                <FaRegComment className="w-4 h-4 text-slate-500 group-hover:text-sky-400" />
                <span className="text-sm text-slate-500 group-hover:text-sky-400">
                    {post.comments.length}
                </span>
            </div>

            {/* Comments Modal */}
            <dialog
                id={`comments_modal_${post._id}`}
                className="modal border-none outline-none"
            >
                <div className="modal-box rounded border border-gray-600">
                    <h3 className="font-bold text-lg mb-4">COMMENTS</h3>

                    <div className="flex flex-col gap-3 max-h-60 overflow-auto">
                        {post.comments.length === 0 && (
                            <p className="text-sm text-slate-500">
                                No comments yet
                            </p>
                        )}

                        {post.comments.map((c: any) => (
                            <div key={c._id} className="flex gap-2 items-start">
                                <div className="avatar w-8 rounded-full">
                                    <img
                                        src={"/avatar-placeholder.png"}
                                    />
                                </div>
                                <div>
                                    <div className="flex gap-1">
                                        <span className="font-bold">
                                            {c.user.fullName}
                                        </span>

                                    </div>
                                    <div className="text-sm">{c.text}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <form
                        className="flex gap-2 items-center mt-4 border-t border-gray-600 pt-2"
                        onSubmit={handlePostComment}
                    >
                        <textarea
                            className="textarea w-full resize-none border border-gray-800"
                            placeholder="Add a comment..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                        <button className="btn btn-primary btn-sm rounded-full text-white px-4">
                            {isCommenting ? <LoadingSpinner size="md" /> : "Post"}
                        </button>
                    </form>
                </div>

                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>





            {/* Repost */}
            <div className="flex gap-1 items-center group cursor-pointer">
                <BiRepost className="w-6 h-6 text-slate-500 group-hover:text-green-500" />
                <span className="text-sm text-slate-500 group-hover:text-green-500">
                    0
                </span>
            </div>

            {/* Like */}
            <div
                className="flex gap-1 items-center group cursor-pointer"
                onClick={handleLikePost}
            >
                {isLiking && <LoadingSpinner size="sm" />}

                {!isLiked && !isLiking && (
                    <FaRegHeart
                        className="w-4 h-4 cursor-pointer text-slate-500 group-hover:text-pink-500"
                    />
                )}

                {isLiked && !isLiking && (
                    <FaRegHeart
                        className="w-4 h-4 cursor-pointer text-pink-500"
                    />
                )}

                <span className={`text-sm flex items-center group-hover:text-pink-500`}>
                    {likes.length}
                </span>
            </div>



        </>
    )
}
