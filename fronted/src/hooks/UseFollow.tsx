import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useFollow as usefollow } from "../Apis.tsx";
import { useAppSelector } from "./useStore.ts";
    const { userData } = useAppSelector(state => state.auth);
    const token = userData?.data?.accessToken

const useFollow = () => {
    const queryClient = useQueryClient();

    const { mutate: follow, isPending } = useMutation({
        mutationFn: (PostId: string) => usefollow(PostId,token || ""),
        onSuccess: () => {
            Promise.all([
                queryClient.invalidateQueries({ queryKey: ["suggestedUsers"] }),
                queryClient.invalidateQueries({ queryKey: ["authUser"] }),//for profile when we click follow in profile it shoudl updates the ui and shows unfollow
            ]);
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    return { follow, isPending };
};

export default useFollow;