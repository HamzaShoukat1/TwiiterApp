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
      console.log("Raw response object:", res);
      const data = await res.json();
      console.log("Parsed response data:", data);
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
}
