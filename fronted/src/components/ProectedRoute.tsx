import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";

export default function App() {
  const navigate = useNavigate();

  const { data: currentUser, isLoading } = useQuery({
    queryKey: ['authUser'],
    queryFn: async () => {
      const res = await fetch("/api/v1/auth/currentUser", {
        credentials: "include" // if using cookies
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Something went wrong");
      return data;
    },
  });

  // Redirect unauthenticated users
  useEffect(() => {
    if (!isLoading && !currentUser) {
      navigate("/sign-in");
    }
  }, [currentUser, isLoading, navigate]);

  // Block UI until auth is resolved
  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center bg-black">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return <Outlet />
}