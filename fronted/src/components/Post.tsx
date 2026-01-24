import { FaRegComment, FaRegHeart } from "react-icons/fa";
import { BiRepost } from "react-icons/bi";
import { FaRegBookmark } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";
import { useState } from "react";
import { Link } from "react-router-dom";
import type { PostType } from "../types"; // adjust path
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import LoadingSpinner from "./LoadingSpinner";
import { formatRelativeTime } from "../lib/createAtfunc";
import { useLikesAndUnlike } from "../mutationsAndQueries.tsx";
type PostProps = {
  post: PostType;
  currentUserId?: string;

};

const Post = ({ post, currentUserId }: PostProps) => {
  const [likes, setLikes] = useState(post.likes); // start with initial likes

  const { LikedPost, isLiking } = useLikesAndUnlike({
    post,
    onSuccess: (updatedLikes) => setLikes(updatedLikes)

  })
  console.log("z", LikedPost)
  const [comment, setComment] = useState("");
  const queryClient = useQueryClient()

  const { mutate: deletePost, isPending } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/v1/post/${post._id}`, {
          method: "delete"
        });
        const data = await res.json()
        if (!res.ok) throw new Error(data.message || "delete post failed")
        return data
      } catch (error) {
        if (error instanceof Error) {
          console.error(error)
          throw error
        } else {
          throw new Error("Something went wrong")
        }
      }
    },
    onSuccess: () => {
      toast.success("Post created Successfully")
      //invalidate the query to refetch
      queryClient.invalidateQueries({
        queryKey: ["posts"]
      })
    }

  })

  const postOwner = post.user;
  console.log("a", currentUserId)

  const isMyPost = currentUserId === postOwner._id;
  const isLiked = currentUserId ? likes.includes(currentUserId) : false


  console.log("sa", isLiked)
  const formattedDate = formatRelativeTime(post.createdAt) // TODO: real date formatter
  const isCommenting = false;

  const handleDeletePost = () => {
    deletePost()

  };

  const handlePostComment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("comment:", comment);
    setComment("");
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
    <div className="flex gap-2 items-start p-4 border-b border-gray-700">
      {/* Avatar */}
      <div className="avatar">
        <Link
          to={`/profile/${postOwner.username}`}
          className="w-8 rounded-full overflow-hidden"
        >
          <img
            src={"/avatar-placeholder.png"}
            alt="avatar"
          />
        </Link>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1">
        {/* Header */}
        <div className="flex gap-2 items-center">
          <Link
            to={`/profile/${postOwner.username}`}
            className="font-bold"
          >
            {postOwner.fullName}
          </Link>

          <span className="text-gray-700 flex gap-1 text-sm">
            <Link to={`/profile/${postOwner.username}`}>
              @{postOwner.username}
            </Link>
            <span>·</span>
            <span>{formattedDate}</span>
          </span>

          {isMyPost && (
            <span className="flex justify-end flex-1 z-10">
              {!isPending && <FaTrash
                className="cursor-pointer  hover:text-red-500"
                onClick={handleDeletePost}
              />}
              {isPending && (
                <LoadingSpinner size="sm" />
              )}
            </span>
          )}
        </div>
        {/* Body */}
        <div className="flex flex-col gap-3 overflow-hidden">
          <span>{post.text}</span>

          {post.postimg && (
            <img
              src={post.postimg.url}
              className="h-80  w-full object-cover  rounded-lg border border-gray-700"
            />
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-between mt-3">
          <div className="flex gap-4 items-center w-2/3 justify-between">
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

                  {post.comments.map((c) => (
                    <div key={c._id} className="flex gap-2 items-start">
                      <div className="avatar w-8 rounded-full">
                        <img
                          src={c.user.profileImage || "/avatar-placeholder.png"}
                          alt="avatar"
                        />
                      </div>
                      <div>
                        <div className="flex gap-1">
                          <span className="font-bold">
                            {c.user.fullName}
                          </span>
                          <span className="text-gray-700 text-sm">
                            @{c.user.username}
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

          </div>

          <div className="flex w-1/3 justify-end items-center">
            <FaRegBookmark className="w-4 h-4 text-slate-500 cursor-pointer" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
