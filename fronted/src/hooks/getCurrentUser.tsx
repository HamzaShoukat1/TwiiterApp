// import { useQuery } from "@tanstack/react-query";
// import { fetchAuthUser } from "../Apis.tsx";



// export const useCurrentUser = () => {
//   const {
//     data: authUser,
//     isLoading,
//     isError,
//   } = useQuery({
//     queryKey: ["authUser"],
//     queryFn: fetchAuthUser,
//     retry: false, 
//     refetchOnWindowFocus:false
//   });

//   const token = authUser?.userData?.data?.accessToken
//   return { authUser, isLoading, isError,token };
// };
