import PostSkeleton from "./PostSkeletan";
import Post from "../../Post";
import { useCurrentUser } from "../../../hooks/getCurrentUser";
import { UseGetAllPosts } from "../../../mutationsAndQueries.tsx";

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


	const { Posts, isRefetching, ispostloading } = UseGetAllPosts({
		endpoint: POST_ENDPOINT,
		feedType,
		enabled: !!authUser
	})

	return (
		<>
			{(isLoading || isRefetching || ispostloading) && (
				<div className='flex flex-col justify-center'>
					<PostSkeleton />
					<PostSkeleton />
					<PostSkeleton />
				</div>
			)}
			{!isLoading && !isRefetching && Posts?.length === 0 && <p className='text-center my-4'>No posts in this tab. Switch 👻</p>}
			{!isLoading && !isRefetching && Posts && (
				<div>
					{Posts.map((post: any) => (
						<Post key={post._id} post={post} currentUserId={authUser?.data._id} />
					))}
				</div>
			)}
		</>
	);
};
export default Posts;