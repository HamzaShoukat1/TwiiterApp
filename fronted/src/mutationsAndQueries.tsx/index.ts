import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useLikesAndUnlike = ({ post,onSuccess }: { post: any,onSuccess?:(likes:string[])=> void }) => {
  const queryClient = useQueryClient();

  const { mutate: LikedPost, isPending: isLiking } = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/v1/post/like/${post._id}`, {
        method: "POST",
      });
      console.log("Raw response object:", res);
      const data = await res.json();
          console.log("Parsed response data:", data);
      if (!res.ok) throw new Error(data.message || "Post like failed");
      return data.data
    },
    onSuccess: (updatedLikes: string[]) => {
      if(onSuccess){
        onSuccess(updatedLikes)
      }
      queryClient.setQueryData(["posts"], (oldData: any | undefined) => {
        if (!oldData) return [];
        return oldData.map((p: any) => {
          if (p._id === post._id) {
            return { ...p, likes: updatedLikes }

          }
          return p
        });

      })
    },
    onError: (error) => {
      if (error instanceof Error) toast.error(error.message);
      else toast.error("Something went wrong");
    },
  });
  console.log("s",LikedPost)

  return { LikedPost, isLiking };
};
