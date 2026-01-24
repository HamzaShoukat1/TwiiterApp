import { Link } from "react-router-dom";
import RightPanelSkeleton from "../RightSIdeSkeleton";
import { useQuery } from "@tanstack/react-query";
import useFollow from "../../../hooks/UseFollow";
import LoadingSpinner from "../../LoadingSpinner";
const RightPanel = () => {
	const { data: SuggestedUsers,isLoading } = useQuery({
		queryKey: ["suggestedUsers"],
		queryFn: async () => {
			try {
				const res = await fetch("/api/v1/user/suggested");
				const data = await res.json()

				if (!res.ok) throw new Error(data.message || "suggested not shows failed")
				console.log(data)
				return data

			} catch (error) {
				if (error instanceof Error) {
					console.error(error)
					throw error
				} else {
					throw new Error("Something went wrong")
				}



			};
			

		},
		
	})
const {follow,isPending} = useFollow()
	return (
		<div className='hidden lg:block my-4 mx-2'>
			<div className='bg-[#16181C] p-4 rounded-md sticky top-2'>
				<p className='font-bold'>Who to follow</p>
				<div className='flex flex-col gap-4'>
					{/* item */}
					{isLoading && (
						<div>
							{Array.from({length:4}).map((_,idx)=> (
								<RightPanelSkeleton key={idx} />
							))}
						</div>
					)}
					{!isLoading &&
						SuggestedUsers?.data?.map((user:any) => (
							<Link
								to={`/profile/${user.username}`}
								className='flex items-center justify-between gap-4'
								key={user._id}
							>
								<div className='flex gap-2 items-center'>
									<div className='avatar'>
										<div className='w-8 rounded-full'>
											<img src={user.profileImg || "/avatar-placeholder.png"} />
										</div>
									</div>
									<div className='flex flex-col'>
										<span className='font-semibold tracking-tight truncate w-28'>
											{user.fullName}
										</span>
										<span className='text-sm text-slate-500'>@{user.username}</span>
									</div>
								</div>
								<div>
									<button
										className='btn bg-white text-black hover:bg-white hover:opacity-90 rounded-full btn-sm'
										onClick={(e) => {
											e.preventDefault()
											follow(user._id)
										}}
									>
										{isPending  ? <LoadingSpinner size="s,"/> : "Follow"}
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