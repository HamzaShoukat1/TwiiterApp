import { FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import type { PostType } from "../types"; // adjust path
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import LoadingSpinner from "./LoadingSpinner";
import { FaRegBookmark } from "react-icons/fa6";

import { formatRelativeTime } from "../lib";
import PostStates from "./Svgs/shared/PostStates";
import { useCurrentUser } from "../hooks/getCurrentUser";
import { deletePost } from "../Apis.tsx";
import { useAppSelector } from "../hooks/useStore.ts";
type PostProps = {
  post: PostType;
  currentUserId?: string;

};

const Post = ({ post, currentUserId }: PostProps) => {
    const { userData } = useAppSelector(state => state.auth);
  const token = userData?.data?.accessToken

  const { authUser } = useCurrentUser()
  //like mutation

  const queryClient = useQueryClient()

  //delt posts
  const { mutate: deletepost, isPending } = useMutation({
    mutationFn: (token:string) => deletePost(post._id,token || ""),

    onSuccess: () => {
      toast.success("Post deleted Successfully")
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
    deletepost(token || "")

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
            src={authUser?.data?.profileImage?.url || "/avatar-placeholder.png"}
            className="w-8 h-8 rounded-full object-cover"
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
