import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";
import { useCurrentUser } from "../hooks/getCurrentUser";

export default function App() {
  const navigate = useNavigate();


  const {authUser,isLoading} = useCurrentUser()

  // Redirect unauthenticated users
  useEffect(() => {
    if (!isLoading && !authUser) {
      navigate("/sign-in");
    }
  }, [authUser, isLoading, navigate]);

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