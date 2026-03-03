import { Outlet } from "react-router-dom";
import { useAppSelector } from "./useStore";
import { Navigate } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";

export default function App() {


  // const {authUser,isLoading} = useCurrentUser()

  // useEffect(() => {
  //   if (!isLoading && !authUser) {
  //     navigate("/sign-in");
  //   }
  // }, [authUser, isLoading, navigate]);

  // // Block UI until auth is resolved
  // if (isLoading) {
  //   return (
  //     <div className="h-screen flex justify-center items-center bg-black">
  //       <LoadingSpinner size="lg" />
  //     </div>
  //   );
  // }

  // return <Outlet />



 const { status, userData } = useAppSelector(state => state.auth);

    // While checking auth, show spinner
    if (status === "loading") {
      return (
            <div className="fixed inset-0 flex items-center justify-center bg-black z-50">
                <LoadingSpinner size="lg" />
            </div>
      )
    }

    // If unauthenticated, redirect immediately
    if (status === "unauthenticated" || !userData) {
        return <Navigate to="/sign-in" replace />;
    }

    // Authenticated → render children
    return <Outlet />;
}