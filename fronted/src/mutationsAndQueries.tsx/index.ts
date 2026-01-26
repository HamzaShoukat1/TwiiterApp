import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";


export const UseSignUp = () => {
  const navigate = useNavigate()

  const { mutate: Signup, isError, isPending, error } = useMutation({
    mutationFn: async (formData: {
      email: string,
      username: string,
      fullName: string,
      password: string
    }) => {
      try {
        const res = await fetch("/api/v1/auth/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formData)
        })

        const data = await res.json()
        if (!res.ok) throw new Error(data.message || "Signup failed")
        console.log(data)
        return data

      } catch (error) {
        if (error instanceof Error) {
          console.error(error)
          throw error
        } else {
          throw new Error("Something went wrong")
        }



      };


    },
    onSuccess: () => {
      toast.success("Account created successfully")
      navigate("/")

    },
    onError: (error) => {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error("Account creation failed")
      }
    }

  })
  return { Signup, isError, isPending, error }

};
export const UseSignin = () => {
  const navigate = useNavigate()

  const { mutate: Signin, isError, isPending, error } = useMutation({
    mutationFn: async (formData: {
      email: string,
      password: string
    }) => {
      try {
        const res = await fetch("/api/v1/auth/signin", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formData)
        })

        const data = await res.json()
        if (!res.ok) throw new Error(data.message || "Signin failed")
        console.log(data)
        return data

      } catch (error) {
        if (error instanceof Error) {
          console.error(error)
          throw error
        } else {
          throw new Error("Something went wrong")
        }



      };

    },
    onSuccess: () => {
      toast.success(" login successfully")
      navigate("/")

    },
    onError: (error) => {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error("Account creation failed")
      }
    }
  })

  return { Signin, isPending, isError, error }
}
export const useLikesAndUnlike = ({ post, onSuccess }: { post: any, onSuccess?: (likes: string[]) => void }) => {
  const queryClient = useQueryClient();

  const { mutate: LikedPost, isPending: isLiking } = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/v1/post/like/${post._id}`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Post like failed");
      return data.data
    },
    onSuccess: (updatedLikes: string[]) => {
      if (onSuccess) {
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
  console.log("s", LikedPost)

  return { LikedPost, isLiking };
};
export const UseGetAllPosts = ({ endpoint, feedType, enabled }: { endpoint: string, feedType: string, enabled: boolean }) => {
  const { data: Posts, isLoading: ispostloading, isRefetching } = useQuery({
    queryKey: ["posts", feedType],
    queryFn: async () => {
      try {
        const res = await fetch(endpoint, {
          credentials: "include"
        });

        const json = await res.json()
        if (!res.ok) throw new Error(json.message || "cannot fetch posts")
        console.log(json)
        return json?.data?.posts ?? []


      }


      catch (error) {
        if (error instanceof Error) {
          console.error(error)
          throw error
        } else {
          throw new Error("Something went wrong")

        }
      }

    },
  }
  )
  enabled
  return { Posts, ispostloading, isRefetching }
};
export const UseCommentPost = () => {
  const queryClient = useQueryClient()

  const { mutate: CommentPost, isPending: isCommenting } = useMutation({
    mutationFn: async ({ postId, text }: { postId: string, text: string }) => {
      const res = await fetch(`/api/v1/post/comment/${postId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ text })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "add  comment failed");
      return data.data
    },
    onSuccess: () => {
      toast.success("comment addedd successfully")

      queryClient.invalidateQueries({
        queryKey: ["posts"]
      })


    },
    onError: (error) => {
      if (error instanceof Error) toast.error(error.message);
      else toast.error("Something went wrong");
    },
  });

  return { CommentPost, isCommenting };
};

export const UseCreatePost = () => {
  const queryClient = useQueryClient()
  const { mutate: CreatePost, isError, isPending, error } = useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await fetch("/api/v1/post/create", {
        method: "POST",
        body: formData
      });

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "post creation failed")
      console.log(data)
      return data

    },


    onSuccess: () => {
      toast.success("post created successfully")
      queryClient.invalidateQueries({ queryKey: ['posts'] })

    },
    onError: (error) => {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error("Post creation creation failed")
      }
    }
  })
  return { CreatePost, isPending, isError, error }

};

export const UseNotification = () => {
  const { data: notifications, isLoading, isError } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/v1/notification");

        const data = await res.json()
        if (!res.ok) throw new Error(data.message || "cannot fetch posts")
        console.log(data)
        return data.data


      }


      catch (error) {
        if (error instanceof Error) {
          console.error(error)
          throw error
        } else {
          throw new Error("Something went wrong")

        }
      }
    },

  })
  return { notifications, isLoading, isError }

}
export const UseDeleteNotification = () => {
  const queryClient = useQueryClient()
  const { mutate: deleteNotification } = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/v1/notification", {
        method: "DELETE",
                credentials: "include",
      });

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "delete notification failed")
          console.log("Delete response:", data);
      return data

    },


    onSuccess: () => {
      toast.success("notification deleted successfully")
      queryClient.invalidateQueries({queryKey: ["notifications"]})
        // queryClient.setQueryData(["notifications"], []);

    },
    onError: (error) => {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error("delelte notification  failed")
      }
    }

  })
  return {deleteNotification}
}

