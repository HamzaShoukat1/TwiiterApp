import { useQuery } from "@tanstack/react-query";
import PostSkeleton from "./PostSkeletan";
import Post from "../../Post";
import { useEffect } from "react";

const Posts = ({ feedType }:any) => {
	
	const getPostsendPoint = () => {
		switch (feedType) {
			case "forYou":
				return "/api/v1/post/all"
			case "following":
				return "/api/v1/post/following"
			default:
				return "/api/v1/post/all"

		}

	}

	const POST_ENDPOINT = getPostsendPoint()

	const { data:Posts, isLoading,refetch,isRefetching } = useQuery({
		queryKey: ["posts",feedType],
		queryFn: async () => {
			try {
				const res = await fetch(POST_ENDPOINT,{
					credentials:"include"
				})
				const json = await res.json()
				if (!res.ok) throw new Error(json.message || "cannot fetch posts")
				console.log(json)
				return json?.data?.posts ?? []


			} catch (error) {
				if (error instanceof Error) {
					console.error(error)
					throw error
				} else {
					throw new Error("Something went wrong")

				}
			}
		}
	})

	useEffect(()=> {
		refetch()

	},[feedType,refetch])
	return (
		<>
			{(isLoading || isRefetching) && (
				<div className='flex flex-col justify-center'>
					<PostSkeleton />
					<PostSkeleton />
					<PostSkeleton />
				</div>
			)}
			{!isLoading  && !isRefetching && Posts?.length === 0 && <p className='text-center my-4'>No posts in this tab. Switch 👻</p>}
			{!isLoading && !isRefetching && Posts && (
				<div>
     {Posts.map((post:any) => (
            <Post key={post._id} post={post} />
          ))}
				</div>
			)}
		</>
	);
};
export default Posts;