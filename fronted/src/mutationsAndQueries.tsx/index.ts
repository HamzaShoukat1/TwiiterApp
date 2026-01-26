import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

// api.ts (or a separate file for API calls)
export const signup = async (formData: {
  email: string;
  username: string;
  fullName: string;
  password: string;
}) => {
  const res = await fetch("/api/v1/auth/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.message || "Signup failed");

  return data;
};
export const signin = async (formData: {
  email: string;
  password: string;
}) => {
  const res = await fetch("/api/v1/auth/signin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.message || "Signin failed");

  return data;
};


export const likePost = async (postId: string) => {
  const res = await fetch(`/api/v1/post/like/${postId}`, {
    method: "POST",
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.message || "Post like failed");

  return data.data;
};

export const GetAllPosts = async (endpoint: string) => {
  const res = await fetch(endpoint, {
    credentials: "include"
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.message || "cannot fetch posts");

  return data?.data?.posts ?? []
};
export const CommentPost = async (postId: string, text: string) => {
  const res = await fetch(`/api/v1/post/comment/${postId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ text })
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.message || "cannot fetch posts");

  return data.data
};
export const CreatePost = async (formData: FormData) => {
  const res = await fetch("/api/v1/post/create", {
    method: "POST",
    body: formData,
    credentials: "include",
  });


  const data = await res.json();

  if (!res.ok) throw new Error(data.message || "post creation failed");

  return data
};

export const Notifications = async () => {
  try {
    const res = await fetch("/api/v1/notification")
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || "cannot fetch notification")
    console.log(data)
    return data.data
  } catch (error) {
    if (error instanceof Error) {
      console.log(error)
      throw error
    } else {
      throw new Error("Something went wrong")

    }

  }


};
export const deleteNoti = async () => {
  try {
    const res = await fetch("/api/v1/notification", {
      method: "DELETE",
      credentials: "include",

    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || "cannot delet notification")
    console.log(data)
    return data
  } catch (error) {
    if (error instanceof Error) {
      console.log(error)
      throw error
    } else {
      throw new Error("Something went wrong")

    }

  }


}









// export const UseNotification = () => {
//   const { data: notifications, isLoading, isError } = useQuery({
//     queryKey: ["notifications"],
//     queryFn: async () => {
//       try {
//         const res = await fetch("/api/v1/notification");

//         const data = await res.json()
//         if (!res.ok) throw new Error(data.message || "cannot fetch posts")
//         console.log(data)
//         return data.data


//       }


//       catch (error) {
//         if (error instanceof Error) {
//           console.error(error)
//           throw error
//         } else {
//           throw new Error("Something went wrong")

//         }
//       }
//     },

//   })
//   return { notifications, isLoading, isError }

// }
// export const UseDeleteNotification = () => {
//   const queryClient = useQueryClient()
//   const { mutate: deleteNotification } = useMutation({
//     mutationFn: async () => {
//       const res = await fetch("/api/v1/notification", {
//         method: "DELETE",
//         credentials: "include",
//       });

//       const data = await res.json()
//       if (!res.ok) throw new Error(data.message || "delete notification failed")
//       console.log("Delete response:", data);
//       return data

//     },


//     onSuccess: () => {
//       toast.success("notification deleted successfully")
//       queryClient.invalidateQueries({ queryKey: ["notifications"] })
//       // queryClient.setQueryData(["notifications"], []);

//     },
//     onError: (error) => {
//       if (error instanceof Error) {
//         toast.error(error.message)
//       } else {
//         toast.error("delelte notification  failed")
//       }
//     }

//   })
//   return { deleteNotification }
// }

