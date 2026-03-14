import PostSkeleton from "./PostSkeletan";
import Post from "../../Post";
import { GetAllPosts } from "../../../Apis.tsx/index.ts";
import { useQuery } from "@tanstack/react-query";
import { useAppSelector } from "../../../hooks/useStore.ts";

const API_URL = import.meta.env.VITE_API_URL;

const Posts = ({ feedType, userId, username }: any) => {
  const { userData } = useAppSelector(state => state.auth);
  const token = userData?.data?.accessToken;

  const getPostEndpoint = () => {
    switch (feedType) {
      case "forYou":
        return `${API_URL}/api/v1/post/all`;
      case "following":
        return `${API_URL}/api/v1/post/following`;
      case "likes":
        return `${API_URL}/api/v1/post/likes/${userId}`;
      case "posts":
        return `${API_URL}/api/v1/post/user/${username}`;
      default:
        return `${API_URL}/api/v1/post/all`;
    }
  };

  const POST_ENDPOINT = getPostEndpoint();

  // Fetch posts with React Query
  const {
    data: posts,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["posts", feedType, username, userId],
    queryFn: () => GetAllPosts(POST_ENDPOINT, token || ""),
    enabled: !!token, // Only fetch if token exists
  });

  return (
    <>
      {(isLoading || isFetching) && (
        <div className="flex flex-col justify-center">
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      )}

      {!isFetching && posts?.length === 0 && (
        <p className="text-center my-4">No posts in this tab.</p>
      )}

      {!isFetching && posts && (
        <div>
          {posts?.map((post: any) => (
            <Post key={post._id} post={post} currentUserId={userData?.data.user._id} />
          ))}
        </div>
      )}
    </>
  );
};

export default Posts;