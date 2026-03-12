import { Link } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner";
import { IoSettingsOutline } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import { deleteNoti, Notifications } from "../../Apis.tsx/index.ts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useAppSelector } from "../../hooks/useStore.ts";
import { useCallback } from "react";

const NotificationPage = () => {
  const { userData } = useAppSelector(state => state.auth);
  const token = userData?.data?.accessToken;

  const queryClient = useQueryClient();

  // Fetch notifications
  const { data: notifications, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => Notifications(token || ""),
    enabled: !!token,
  });

  // Delete all notifications
  const { mutate: deleteAllNotifications, isPending: isDeleting } = useMutation({
    mutationFn: () => deleteNoti(token || ""),
    onSuccess: () => {
      toast.success("Notifications deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (error) => {
      if (error instanceof Error) toast.error(error.message);
      else toast.error("Failed to delete notifications");
    },
  });

  const handleDeleteAll = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      deleteAllNotifications();
    },
    [deleteAllNotifications]
  );

  return (
    <div className="flex-[4_4_0] border-l border-r border-gray-700 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-gray-700">
        <p className="font-bold">Notifications</p>
        {notifications?.length > 0 && (
          <div className="dropdown">
            <div tabIndex={0} role="button" className="m-1">
              <IoSettingsOutline className="w-4" />
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content z-10 menu p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <button onClick={handleDeleteAll} disabled={isDeleting}>
                  {isDeleting ? "Deleting..." : "Delete all notifications"}
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex justify-center h-full items-center">
          <LoadingSpinner size="lg" />
        </div>
      )}

      {/* Empty state */}
      {!isLoading && notifications?.length === 0 && (
        <div className="text-center p-4 font-bold">No notifications</div>
      )}

      {/* Notifications list */}
      {!isLoading &&
        notifications?.map((notification: any) => (
          <div className="border-b border-gray-700" key={notification._id}>
            <div className="flex gap-2 p-4 items-center">
              {notification.type === "follow" && (
                <FaUser className="w-7 h-7 text-primary" />
              )}
              {notification.type === "like" && (
                <FaHeart className="w-7 h-7 text-red-500" />
              )}
              <Link
                to={`/profile/${notification.from.username}`}
                className="flex gap-2 items-center flex-1"
              >
                <div className="avatar">
                  <div className="w-8 rounded-full">
                    <img
                      src={notification.from.profileImage || "/avatar-placeholder.png"}
                    />
                  </div>
                </div>
                <div className="flex gap-1">
                  <span className="font-bold">@{notification.from.username}</span>{" "}
                  {notification.type === "follow"
                    ? "followed you"
                    : "liked your post"}
                </div>
              </Link>
            </div>
          </div>
        ))}
    </div>
  );
};

export default NotificationPage;