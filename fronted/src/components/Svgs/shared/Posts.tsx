import PostSkeleton from "./PostSkeletan";
import Post from "../../Post";
import { useCurrentUser } from "../../../hooks/getCurrentUser";
import { GetAllPosts } from "../../../mutationsAndQueries.tsx";
import { useQuery } from "@tanstack/react-query";

const Posts = ({ feedType }: any) => {

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


	// Fetch current user
	const { authUser, isLoading } = useCurrentUser()
	const {data:Posts,isPending:ispostloading,} = useQuery({
		queryKey: ["posts",feedType],
		queryFn: ()=>GetAllPosts(POST_ENDPOINT)

	})




	return (
		<>
			{(isLoading  || ispostloading) && (
				<div className='flex flex-col justify-center'>
					<PostSkeleton />
					<PostSkeleton />
					<PostSkeleton />
				</div>
			)}
			{!isLoading &&  Posts?.length === 0 && <p className='text-center my-4'>No posts in this tab. Switch 👻</p>}
			{!isLoading  && Posts && (
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