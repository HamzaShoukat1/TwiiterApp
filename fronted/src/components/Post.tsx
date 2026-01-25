import { FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import type { PostType } from "../types"; // adjust path
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import LoadingSpinner from "./LoadingSpinner";
import { FaRegBookmark } from "react-icons/fa6";

import { formatRelativeTime } from "../lib/createAtfunc";
import PostStates from "./Svgs/shared/PostStates";
type PostProps = {
  post: PostType;
  currentUserId?: string;

};

const Post = ({ post, currentUserId }: PostProps) => {

  //like mutation

  const queryClient = useQueryClient()

  //delt posts
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

  const isMyPost = currentUserId === postOwner._id;


  const formattedDate = formatRelativeTime(post.createdAt)

  const handleDeletePost = () => {
    deletePost()

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
            <PostStates post={post} currentUserId={currentUserId} />

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
