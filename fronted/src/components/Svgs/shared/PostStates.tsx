import { FaRegComment, FaRegHeart } from "react-icons/fa";
import { BiRepost } from "react-icons/bi";
import { useState, useCallback, useRef } from "react";
import { CommentPost, likePost } from "../../../Apis.tsx/index.ts";
import LoadingSpinner from "../../LoadingSpinner";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppSelector } from "../../../hooks/useStore.ts";

export default function PostStates({ currentUserId, post }: { currentUserId?: string; post: any }) {
  const { userData } = useAppSelector(state => state.auth);
  const token = userData?.data?.accessToken;

  const [likes, setLikes] = useState(post.likes);
  const [comment, setComment] = useState("");
  const isLiked = currentUserId ? likes.includes(currentUserId) : false;

  const queryClient = useQueryClient();
    const modalRef = useRef<HTMLDialogElement | null>(null);


  // Like mutation
  const { mutate: likeMutate, isPending: isLiking } = useMutation({
    mutationFn: () => likePost(post._id, token || ""),
    onSuccess: (updatedLikes: string[]) => {
      setLikes(updatedLikes);

      queryClient.setQueryData(["posts"], (oldData: any | undefined) =>
        oldData?.map((p: any) => (p._id === post._id ? { ...p, likes: updatedLikes } : p)) ?? []
      );
    },
    onError: (error) => {
      if (error instanceof Error) toast.error(error.message);
      else toast.error("Something went wrong");
    },
  });

  // Comment mutation
  const { mutate: commentMutate, isPending: isCommenting } = useMutation({
    mutationFn: (text: string) => CommentPost(post._id, text, token || ""),
    onSuccess: () => {
      toast.success("Comment added successfully");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error) => {
      if (error instanceof Error) toast.error(error.message);
      else toast.error("Something went wrong");
    },
  });

  // Handlers
  const handleLikePost = useCallback(() => {
    if (!isLiking) likeMutate();
  }, [isLiking, likeMutate]);

  const handlePostComment = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!comment.trim() || isCommenting) return;
      commentMutate(comment);
      setComment("");
    },
    [comment, isCommenting, commentMutate]
  );

  const openCommentsModal = useCallback(() => {
    modalRef.current?.showModal();
  }, []);

  return (
    <>
      {/* Comments */}
      <div className="flex gap-1 items-center cursor-pointer group" onClick={openCommentsModal}>
        <FaRegComment className="w-4 h-4 text-slate-500 group-hover:text-sky-400" />
        <span className="text-sm text-slate-500 group-hover:text-sky-400">{post.comments.length}</span>
      </div>

      {/* Comments Modal */}
      <dialog  ref={modalRef}  className="modal border-none outline-none">
        <div className="modal-box rounded border border-gray-600">
          <h3 className="font-bold text-lg mb-4">COMMENTS</h3>

          <div className="flex flex-col gap-3 max-h-60 overflow-auto">
            {post.comments.length === 0 && <p className="text-sm text-slate-500">No comments yet</p>}

            {post.comments.map((c: any) => (
             c.user ? ( <div key={c._id} className="flex gap-2 items-start">
                <div className="avatar w-8 rounded-full">
                  <img src={c.user.profileImage?.url || "/avatar-placeholder.png"} alt={c.user.fullName} />
                </div>
                <div>
                  <div className="flex gap-1">
                    <span className="font-bold">{c.user.fullName}</span>
                  </div>
                  <div className="text-sm">{c.text}</div>
                </div>
              </div>) : null
            ))}
          </div>

          <form className="flex gap-2 items-center mt-4 border-t border-gray-600 pt-2" onSubmit={handlePostComment}>
            <textarea
              className="textarea w-full resize-none border border-gray-800"
              placeholder="Add a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button className={ `btn btn-primary btn-sm rounded-full text-white px-4 ${isCommenting && "cursor-not-allowed"} `}>
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
        <span className="text-sm text-slate-500 group-hover:text-green-500">0</span>
      </div>

      {/* Like */}
      <div className="flex gap-1 items-center group cursor-pointer" onClick={handleLikePost}>
        {isLiking && <LoadingSpinner size="sm" />}

        {!isLiked && !isLiking && <FaRegHeart className="w-4 h-4 cursor-pointer text-slate-500 group-hover:text-pink-500" />}
        {isLiked && !isLiking && <FaRegHeart className="w-4 h-4 cursor-pointer text-pink-500" />}

        <span className="text-sm flex items-center group-hover:text-pink-500">{likes.length}</span>
      </div>
    </>
  );
}