import { useQuery } from "@tanstack/react-query";

export const fetchAuthUser = async () => {
  const res = await fetch("/api/v1/auth/currentUser", {
    credentials: "include",
  });

  if (!res.ok) return null;
  return res.json();
};

export const useCurrentUser = () => {
  const {
    data: authUser,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["authUser"],
    queryFn: fetchAuthUser,
    retry: false, 
  });

  return { authUser, isLoading, isError };
};
