import PostSkeleton from "./PostSkeletan";
import Post from "../../Post";
import { useCurrentUser } from "../../../hooks/getCurrentUser";
import { GetAllPosts } from "../../../Apis.tsx/index.ts";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
const API_URL = import.meta.env.VITE_API_URL;

const Posts = ({ feedType, userId, username }: any) => {

	const getPostsendPoint = () => {



		switch (feedType) {
			case "forYou":
				return `${API_URL}/v1/post/all`
			case "following":
				return `${API_URL}/v1/post/following`
			case "likes":
				return `${API_URL}/v1/post/likes/${userId}`
			case "posts":
				return `${API_URL}/v1/post/user/${username}`
			default:
				return `${API_URL}/v1/post/all`

		}


	}

	const POST_ENDPOINT = getPostsendPoint()
	console.log("POST ENDPOINT ", POST_ENDPOINT);



	// Fetch current user
	const { authUser, isLoading } = useCurrentUser()
	const { data: Posts, isPending: ispostloading, refetch, isRefetching } = useQuery({
		queryKey: ["posts"],
		queryFn: () => GetAllPosts(POST_ENDPOINT),

	})
	console.log("all", Posts)
	useEffect(() => {
		refetch()

	}, [feedType, username, refetch, userId])







	return (
		<>
			{(isLoading || ispostloading || isRefetching) && (
				<div className='flex flex-col justify-center'>
					<PostSkeleton />
					<PostSkeleton />
					<PostSkeleton />
				</div>
			)}
			{!isLoading && !isRefetching && Posts?.length === 0 && <p className='text-center my-4'>No posts in this tab. Switch </p>}
			{!isLoading && !isRefetching && Posts && (
				<div>

					{Posts?.map((post: any,) => (

							<Post key={post._id} post={post} currentUserId={authUser?.data._id} />
					))}

				</div>
			)}
		</>
	);
};
export default Posts;