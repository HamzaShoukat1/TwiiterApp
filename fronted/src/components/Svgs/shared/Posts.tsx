import PostSkeleton from "./PostSkeletan";
import Post from "../../Post";
import { useCurrentUser } from "../../../hooks/getCurrentUser";
import { GetAllPosts } from "../../../Apis.tsx/index.ts";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

const Posts = ({ feedType, userId, username }: any) => {

	const getPostsendPoint = () => {

		console.log("FEED TYPE 👉", feedType);
		console.log("USER ID 👉", userId);
		console.log("USERNAME 👉", username);

		switch (feedType) {
			case "forYou":
				return "/api/v1/post/all"
			case "following":
				return "/api/v1/post/following"
			case "likes":
				return `/api/v1/post/likes/${userId}`
			case "posts":
				return `/api/v1/post/user/${username}`
			default:
				return "/api/v1/post/all"

		}


	}

	const POST_ENDPOINT = getPostsendPoint()
	console.log("POST ENDPOINT 👉", POST_ENDPOINT);



	// Fetch current user
	const { authUser, isLoading } = useCurrentUser()
	const { data: Posts, isPending: ispostloading ,refetch,isRefetching} = useQuery({
		queryKey: ["posts",feedType,userId,username],
		queryFn: () => GetAllPosts(POST_ENDPOINT),
		enabled: !!POST_ENDPOINT

	})

	useEffect(() => {
		refetch()
	 
	}, [feedType,username,refetch])
	






	return (
		<>
			{(isLoading || ispostloading || isRefetching) && (
				<div className='flex flex-col justify-center'>
					<PostSkeleton />
					<PostSkeleton />
					<PostSkeleton />
				</div>
			)}
			{!isLoading && !isRefetching &&  Posts?.length === 0 && <p className='text-center my-4'>No posts in this tab. Switch 👻</p>}
			{!isLoading  && !isRefetching && Posts && (
				<div>
					{Posts?.map((post: any) => (
						<Post key={post._id} post={post} currentUserId={authUser?.data._id} />
					))}
				</div>
			)}
		</>
	);
};
export default Posts;