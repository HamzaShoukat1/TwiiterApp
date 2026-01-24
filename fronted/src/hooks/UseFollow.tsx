import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const useFollow = () => {
    const queryClient = useQueryClient();

    const { mutate: follow, isPending } = useMutation({
        mutationFn: async (userId) => {
            try {
                const res = await fetch(`/api/v1/user/follow/${userId}`, {
                    method: "POST",
                });

                const data = await res.json();
                if (!res.ok) {
                    throw new Error(data.message || "Something went wrong!");
                }
                return;
            } catch (error) {
                if (error instanceof Error) {
                    console.error(error)
                    throw error
                } else {
                    throw new Error("Something went wrong")
                }
            }
        },
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