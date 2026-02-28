import { Outlet, useNavigate } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";
import { useAppSelector } from "../hooks/useStore";

export default function App() {
  const navigate = useNavigate();


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

const {status,userData} = useAppSelector(state => state.auth);

if (!userData) {
  navigate("/sign-in");
}

if (status === "pending") {
  return (
    <div className="h-screen flex justify-center items-center bg-black">
      <LoadingSpinner size="lg" />
    </div>
  );
}

return <Outlet />;
}


