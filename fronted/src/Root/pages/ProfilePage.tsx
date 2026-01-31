import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";

// import Posts from "../../components/common/Posts";
// import ProfileHeaderSkeleton from "../../components/skeletons/ProfileHeaderSkeleton";
// import EditProfileModal from "../components/Svgs/shared/EditProfileModel.tsx";


import { FaArrowLeft } from "react-icons/fa6";
import { IoCalendarOutline } from "react-icons/io5";
import { FaLink } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UserProfile, UseUpdateProfilePic } from "../../Apis.tsx/index.ts";
import ProfileHeaderSkeleton from "../../components/Svgs/shared/ProfileHeader.tsx";
import { formatMemberSinceDate } from "../../lib/index.ts";
import Posts from "../../components/Svgs/shared/Posts.tsx";
import { useCurrentUser } from "../../hooks/getCurrentUser.tsx";
import useFollow from "../../hooks/UseFollow.tsx";
import LoadingSpinner from "../../components/LoadingSpinner.tsx";
import EditProfileModal from "../../components/Svgs/shared/EditProfileModel.tsx";
import toast from "react-hot-toast";
import EditPasswordModel from "../../components/Svgs/shared/EditPasswordModel.tsx";

const ProfilePage = () => {
	const [coverImage, setCoverImage] = useState<string | null>(null);
	const [profileImage, setProfileImage] = useState<string | null>(null);
	const [feedType, setFeedType] = useState("posts");
	const coverImgRef = useRef<HTMLInputElement | null>(null);
	const profileImgRef = useRef<HTMLInputElement | null>(null);
	const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
	const [coverImageFile, setcoverImageFile] = useState<File | null>(null);


	const { username } = useParams()
	const queryClient = useQueryClient()


	const { data: user, isLoading, refetch, isRefetching } = useQuery({
		queryKey: ["userProfile",],
		queryFn: () => UserProfile(username),
		enabled: !!username
	})

	//when we refresh then img shoulf not removed
	useEffect(() => {
		if (user) {
			setProfileImage(user.profileImage?.url || null);
			setCoverImage(user.coverImage?.url || null);
		}
	}, [user]);

	const { mutate: updateProfile, isPending: isprofileuploading } = useMutation({
		mutationFn: (formData: FormData) => UseUpdateProfilePic(formData),
		onSuccess: () => {
			// const updatesUser = res.data
			toast.success("Profile  updated successfully")

			// queryClient.setQueryData(["authUser"], (oldData: any) => {
			// 	if (!oldData) return {data:updatesUser}
			// 	return {
			// 		...oldData,
			// 		data: {
			// 			...oldData.data,
			// 			profileImage: updatesUser.profileImage,
			// 			coverImage: updatesUser.coverImage,
			// 		}
			// 	}
			// });
			queryClient.invalidateQueries({ queryKey: ["userProfile"] })
			queryClient.invalidateQueries({ queryKey: ["authUser"] })




		}
	});

	const { follow, isPending } = useFollow()
	const { authUser } = useCurrentUser()
	console.log("az", authUser)

	const isMyProfile = authUser?.data?._id === user?._id
	const amIFollowing = authUser?.data.following?.includes(user?._id)
	const memberSinceData = formatMemberSinceDate(user?.createdAt)
	const handleImgChange = ({ target }: React.ChangeEvent<HTMLInputElement>, type: "coverImage" | "profileImage") => {
		const file = target.files?.[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onload = () => {
			const img = reader.result as string;
			if (type === "profileImage") {
				setProfileImage(img)
				setProfileImageFile(file)
			} else {
				setCoverImage(img)
				setcoverImageFile(file)
			}
		};
		reader.readAsDataURL(file);

	};
	useEffect(() => {
		refetch()
	}, [username, refetch])

	const hasChanges = !!profileImageFile || !!coverImageFile;



	return (
		<>
			<div className='flex-[4_4_0]  border-r border-gray-700 min-h-screen '>
				{/* HEADER */}
				{isLoading && isRefetching && <ProfileHeaderSkeleton />}
				{!isLoading && !isRefetching && !user && <p className='text-center text-lg mt-4'>User not found</p>}
				<div className='flex flex-col'>
					{!isLoading && !isRefetching && user && (
						<>
							<div className='flex gap-10 px-4 py-2 items-center'>
								<Link to='/'>
									<FaArrowLeft className='w-4 h-4' />
								</Link>

							</div>
							{/* COVER IMG */}
							<div className='relative group/cover'>
								<img
									src={coverImage || user?.coverImage || "/cover.png"}
									alt=""
									className='h-52 w-full bg-gray-400 object-cover'

								/>
								{isMyProfile && (
									<div
										className='absolute top-2 right-2 rounded-full p-2 bg-gray-800 bg-opacity-75 cursor-pointer opacity-0 group-hover/cover:opacity-100 transition duration-200'
										onClick={() => coverImgRef.current?.click()}
									>
										<MdEdit className='w-5 h-5 text-white' />
									</div>
								)}

								<input
									type='file'
									hidden
									ref={coverImgRef}
									onChange={(e) => handleImgChange(e, "coverImage")}
								/>
								<input
									type='file'
									hidden
									ref={profileImgRef}
									onChange={(e) => handleImgChange(e, "profileImage")}
								/>
								{/* USER AVATAR */}
								<div className='avatar absolute -bottom-16 left-4'>
									<div className='w-32 rounded-full relative group/avatar'>
										<img src={profileImage || "/avatar-placeholder.png"} />
										<div className='absolute top-5 right-3 p-1 bg-primary rounded-full group-hover/avatar:opacity-100 opacity-0 cursor-pointer'>
											{isMyProfile && (
												<MdEdit
													className='w-4 h-4 text-white'
													onClick={() => profileImgRef.current?.click()}
												/>
											)}
										</div>
									</div>
								</div>
							</div>
							<div className='flex justify-end px-4 mt-5 gap-3'>

								{isMyProfile && (
									<>
									<EditProfileModal authUser={authUser} />
									<EditPasswordModel />
									</>
								)}
								{!isMyProfile && (
									<button
										className='btn btn-outline rounded-full btn-sm'
										onClick={() => follow(user?._id)}
									>
										{isPending && <LoadingSpinner />}
										{!isPending && amIFollowing && "Unfollow"}
										{!isPending && !amIFollowing && "Follow"}

									</button>
								)}
							
								{(coverImage || profileImage) && (
									

								<button
									disabled={isprofileuploading || !hasChanges}
									className={`btn btn-primary rounded-full btn-sm text-white px-4 ml-2 ${!hasChanges &&'hidden'}`}
									onClick={(e) => {
										e.preventDefault()
										if (!hasChanges) return;

										const formData = new FormData();
										if (profileImageFile) formData.append("profileImage", profileImageFile);
										if (coverImageFile) formData.append("coverImage", coverImageFile);

										updateProfile(formData, {
											onSuccess: () => {
												// reset local files after successful upload
												setProfileImageFile(null);
												setcoverImageFile(null);
											}
										});
									}}
								>
									{isprofileuploading ? <LoadingSpinner /> : 'Update'}
								</button>

								)}
							</div>

							<div className='flex flex-col gap-4 mt-14 px-4'>
								<div className='flex flex-col'>
									<span className='font-bold text-lg'>{user?.fullName}</span>
									<span className='text-sm text-slate-500'>@{user?.username}</span>
									<span className='text-sm my-1'>{user?.bio}</span>
								</div>

								<div className='flex gap-2 flex-wrap'>
									{user?.link && (
  <div className='flex gap-1 items-center'>
    <FaLink className='w-3 h-3 text-slate-500' />
    <a
      href={user.link.startsWith("http") ? user.link : `https://${user.link}`}
      target='_blank'
      rel='noreferrer'
      className='text-sm text-blue-500 hover:underline break-all'
    >
      {user.link}
    </a>
  </div>
)}

									<div className='flex gap-2 items-center'>
										<IoCalendarOutline className='w-4 h-4 text-slate-500' />
										<span className='text-sm text-slate-500'>{memberSinceData}</span>
									</div>
								</div>
								<div className='flex gap-2'>
									<div className='flex gap-1 items-center'>
										<span className='font-bold text-xs'>{user?.following.length}</span>
										<span className='text-slate-500 text-xs'>Following</span>
									</div>
									<div className='flex gap-1 items-center'>
										<span className='font-bold text-xs'>{user?.followers.length}</span>
										<span className='text-slate-500 text-xs'>Followers</span>
									</div>
								</div>
							</div>
							<div className='flex w-full border-b border-gray-700 mt-4'>
								<div
									className='flex justify-center flex-1 p-3  transition duration-300 relative cursor-pointer'
									onClick={() => setFeedType("posts")}
								>
									Posts
									{feedType === "posts" && (
										<div className='absolute bottom-0 w-10 h-1 rounded-full bg-primary' />
									)}
								</div>
								<div
									className='flex justify-center flex-1 p-3 text-slate-500  transition duration-300 relative cursor-pointer'
									onClick={() => setFeedType("likes")}
								>
									Likes
									{feedType === "likes" && (
										<div className='absolute bottom-0 w-10  h-1 rounded-full bg-primary' />
									)}
								</div>
							</div>
						</>
					)}

					<Posts feedType={feedType} userId={user?._id} username={username} />
				</div>
			</div>
		</>
	);
};
export default ProfilePage;