export const fetchAuthUser = async () => {
  const res = await fetch("/api/v1/auth/currentUser", {
    credentials: "include",
  });

  if (!res.ok) return null;
  return res.json();
};
