import { Outlet, useNavigate } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "./components/LoadingSpinner";

export default function App() {
  const navigate = useNavigate()

  const { data: currentUser, isLoading } = useQuery({
    queryKey: ['authUser'],
    queryFn: async () => {
      try {
        const res = await fetch("/api/v1/auth/currentUser")
        const data = await res.json()
        if (!res.ok) {
          throw new Error(data.message || "Something went wrong")
        }
        return data

      } catch (error) {
        if (error instanceof Error) {
          console.error(error)
          throw error
        } else {
          throw new Error("Something went wrong")
        }

      }

    }
  })


  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <LoadingSpinner size="lg" />

      </div>
    )
  }

  if (currentUser) {
    navigate("/")
  }

  return (
    <div>
      <main>
        <Outlet />
        <Toaster />
      </main>
    </div>
  )
}


