import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState, useCallback } from "react";
import { UseupdateAccountDetails } from "../../../Apis.tsx";
import toast from "react-hot-toast";
import { useAppSelector } from "../../../hooks/useStore.ts";

const EditProfileModal = ({ authUser }: any) => {
	const { userData } = useAppSelector(state => state.auth);
	const token = userData?.data?.accessToken;
	const queryClient = useQueryClient();

	const [formData, setFormData] = useState({
		fullName: "",
		username: "",
		email: "",
		bio: "",
		link: "",
	});

	const dialogRef = useRef<HTMLDialogElement | null>(null);

	// Mutation for updating profile
	const { mutate: updateProfile, isPending: isUpdatingProfile } = useMutation({
		mutationFn: (data: typeof formData) => UseupdateAccountDetails(data, token || ""),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["authUser"] });
			queryClient.invalidateQueries({ queryKey: ["userProfile"] });
			toast.success("Account details updated successfully");
		},
	});

	// Prefill form data when authUser changes
	useEffect(() => {
		if (authUser) {
			setFormData({
				fullName: authUser.fullName || "",
				username: authUser.username || "",
				email: authUser.email || "",
				bio: authUser.bio || "",
				link: authUser.link || "",
			});
		}
	}, [authUser]);

	// Open dialog
	const openDialog = useCallback(() => {
		dialogRef.current?.showModal();
	}, []);

	// Handle input changes
	const handleInputChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
			const { name, value } = e.target;
			setFormData(prev => ({ ...prev, [name]: value }));
		},
		[]
	);

	// Handle form submission
	const handleSubmit = useCallback(
		(e: React.FormEvent<HTMLFormElement>) => {
			e.preventDefault();
			updateProfile(formData);
		},
		[formData, updateProfile]
	);

	return (
		<>
			<button className='btn btn-outline rounded-full btn-sm' onClick={openDialog}>
				Edit profile
			</button>

			<dialog ref={dialogRef} className='modal'>
				<div className='modal-box border rounded-md border-gray-700 shadow-md'>
					<h3 className='font-bold text-lg my-3'>Update Profile</h3>

					<form className='flex flex-col gap-4' onSubmit={handleSubmit}>
						<div className='flex flex-wrap gap-2'>
							<input
								type='text'
								name='fullName'
								placeholder='Full Name'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.fullName}
								onChange={handleInputChange}
							/>
							<input
								type='text'
								name='username'
								placeholder='Username'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.username}
								onChange={handleInputChange}
							/>
						</div>

						<div className='flex flex-wrap gap-2'>
							<input
								type='email'
								name='email'
								placeholder='Email'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.email}
								onChange={handleInputChange}
							/>
							<textarea
								name='bio'
								placeholder='Bio'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.bio}
								onChange={handleInputChange}
							/>
						</div>

						<input
							type='text'
							name='link'
							placeholder='Link'
							className='flex-1 input border border-gray-700 rounded p-2 input-md'
							value={formData.link}
							onChange={handleInputChange}
						/>

						<button className='btn btn-primary rounded-full btn-sm text-white'>
							{isUpdatingProfile ? "Updating..." : "Update"}
						</button>
					</form>
				</div>

				<form method='dialog' className='modal-backdrop'>
					<button className='outline-none'>close</button>
				</form>
			</dialog>
		</>
	);
};

export default EditProfileModal;