const API_URL = import.meta.env.VITE_API_URL;

// ================= AUTH =================

export const signup = async (formData: {
  email: string;
  username: string;
  fullName: string;
  password: string;
}) => {
  const res = await fetch(`${API_URL}/v1/auth/signup`, {
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

export const signin = async (formData: { email: string; password: string }) => {
  const res = await fetch(`${API_URL}/v1/auth/signin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
    credentials: "include",
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Signin failed");

  return data;
};
export const logout = async () => {
  const res = await fetch(`${API_URL}/v1/auth/logout`, {
    method: "POST",

    credentials: "include",
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "logout failed");

  return data;
};

export const fetchAuthUser = async () => {
  const res = await fetch(`${API_URL}/v1/auth/currentUser`, {
    credentials: "include",
  });

  if (!res.ok) return null;
  return res.json();
};

// ================= POSTS =================

export const likePost = async (postId: string) => {
  const res = await fetch(`${API_URL}/v1/post/like/${postId}`, {
    method: "POST",
    credentials: "include",
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Post like failed");

  return data.data;
};

export const GetAllPosts = async (endpoint: string) => {
  const res = await fetch(endpoint, {
    method:"POST",
    credentials: "include",
      headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "cannot fetch posts");

  return data?.data?.posts ?? data?.data ?? [];
};

export const CommentPost = async (postId: string, text: string) => {
  const res = await fetch(`${API_URL}/v1/post/comment/${postId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
    credentials: "include",
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "comment failed");

  return data.data;
};

export const CreatePost = async (formData: FormData) => {
  const res = await fetch(`${API_URL}/v1/post/create`, {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "post creation failed");

  return data;
};
export const deletePost = async (postId: string) => {
  const res = await fetch(`${API_URL}/v1/post/${postId}`, {
    method: "delete",
    credentials: "include",
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "post deletion failed");

  return data;
};

// ================= NOTIFICATIONS =================

export const Notifications = async () => {
  const res = await fetch(`${API_URL}/v1/notification`, {
    credentials: "include",
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "cannot fetch notification");

  return data.data;
};

export const deleteNoti = async () => {
  const res = await fetch(`${API_URL}/v1/notification`, {
    method: "DELETE",
    credentials: "include",
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "cannot delete notification");

  return data;
};

// ================= USER =================

export const UserProfile = async (username: string) => {
  const res = await fetch(`${API_URL}/v1/user/profile/${username}`);

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "cannot fetch user profile");

  return data.data;
};

export const UseUpdateProfilePic = async (formData: FormData) => {
  const res = await fetch(`${API_URL}/v1/user/update-profile`, {
    method: "PATCH",
    body: formData,
    credentials: "include",
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "profile update failed");

  return data;
};
export const useFollow = async (PostId: string) => {
  const res = await fetch(`${API_URL}/v1/user/follow/${PostId}`, {
    method: "POST",
    credentials: "include",
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "user follow failed");

  return data;
};
export const UseupdateAccountDetails = async (formData: any) => {
  const res = await fetch(`${API_URL}/v1/user/account`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
    credentials: "include",
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "cannot update account");

  return data;
};

export const UseUpdatePassword = async (formData: any) => {
  const res = await fetch(`${API_URL}/v1/user/change-password`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
    credentials: "include",
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "cannot update password");

  return data;
};
export const suggestedUsers = async () => {
  const res = await fetch(`${API_URL}/v1/user/suggested`);

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "cannot fetch suggested password");

  return data;
};

// ================= EMAIL =================

export const VerifyEmail = async (formData: { code: string }) => {
  const res = await fetch(`${API_URL}/v1/auth/verify-email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "verify account failed");

  return data;
};

export const forgetPassword = async (formData: { email: string }) => {
  const res = await fetch(`${API_URL}/v1/auth/forget-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "forget password failed");

  return data;
};

export const resetPassword = async (formData: {
  newpassword: string;
  confirmPassword: string;
  token: string;
}) => {
  const res = await fetch(
    `${API_URL}/v1/auth/reset-password/${formData.token}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        newpassword: formData.newpassword,
        confirmPassword: formData.confirmPassword,
      }),
    }
  );

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Reset password failed");

  return data;
};