import { Link } from "react-router-dom";
import RightPanelSkeleton from "../RightSIdeSkeleton";
import { useQuery } from "@tanstack/react-query";
import useFollow from "../../../hooks/UseFollow";
import LoadingSpinner from "../../LoadingSpinner";
import { suggestedUsers } from "../../../Apis.tsx";
import { useAppSelector } from "../../../hooks/useStore.ts";
import { useCallback } from "react";

const RightPanel = () => {
  const { userData } = useAppSelector((state) => state.auth);
  const token = userData?.data?.accessToken;

  const { data: SuggestedUsers, isLoading } = useQuery({
    queryKey: ["suggestedUsers"],
    queryFn: () => suggestedUsers(token || ""),
    enabled: !!token,
  });

  const { follow, isPending } = useFollow();

  const handleFollow = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>, userId: string) => {
      e.preventDefault();
      follow(userId);
    },
    [follow]
  );

  return (
    <div className="hidden lg:block my-4 mx-2">
      <div className="bg-[#16181C] p-4 rounded-md sticky top-2">
        <p className="font-bold mb-2">Who to follow</p>

        <div className="flex flex-col gap-4">
          {/* Loading skeleton */}
          {isLoading &&
            Array.from({ length: 4 }).map((_, idx) => (
              <RightPanelSkeleton key={idx} />
            ))}

          {/* Suggested users */}
          {!isLoading &&
            SuggestedUsers?.data?.map((user: any) => (
              <Link
                to={`/profile/${user.username}`}
                className="flex items-center justify-between gap-4"
                key={user._id}
              >
                <div className="flex gap-2 items-center">
                  <div className="avatar">
                    <div className="w-8 rounded-full">
                      <img
                        src={user.profileImg || "/avatar-placeholder.png"}
                        alt={user.username}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold tracking-tight truncate w-28">
                      {user.fullName}
                    </span>
                    <span className="text-sm text-slate-500">
                      @{user.username}
                    </span>
                  </div>
                </div>
                <div>
                  <button
                    className="btn bg-white text-black hover:bg-white hover:opacity-90 rounded-full btn-sm"
                    onClick={(e) => handleFollow(e, user._id)}
                    disabled={isPending}
                  >
                    {isPending ? <LoadingSpinner size="sm" /> : "Follow"}
                  </button>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
};

export default RightPanel;