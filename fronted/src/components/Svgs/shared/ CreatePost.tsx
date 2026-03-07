import { CiImageOn } from "react-icons/ci";
import { BsEmojiSmileFill } from "react-icons/bs";
import React, { useRef, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreatePost } from "../../../Apis.tsx/index.ts";
import { useAppSelector } from "../../../hooks/useStore.ts";


const Createpost = () => {
	const { userData } = useAppSelector(state => state.auth);
	const token = userData?.data?.accessToken
	const queryClient = useQueryClient()
	const [text, setText] = useState("");
	const [img, setImg] = useState<string | null>(null);
	const imgRef = useRef<HTMLInputElement | null>(null);
	const { mutate: createPost, isPending, isError, error } = useMutation({
		mutationFn: (formData: FormData) => CreatePost(formData, token || ""),
		onSuccess: () => {
			toast.success("Post created successfully!");
			queryClient.invalidateQueries({ queryKey: ["posts"] });
			setText("");
			setImg(null);
			if (imgRef.current) imgRef.current.value = "";
		},
		onError: (err) => {
			if (err instanceof Error) toast.error(err.message);
			else toast.error("Post creation failed");
		},

	})



	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!text.trim() && !img) {
			toast.error("Post cannot be empty");
			return
		}
		const formData = new FormData()
		formData.append("text", text)
		if (imgRef?.current?.files?.[0]) {
			formData.append("postimg", imgRef.current.files[0]);
		}
		createPost(formData)
	};

	const handleImgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (!file) return;
		const reader = new FileReader();
		reader.onload = () => {
			setImg(reader.result as string);
		}
		reader.readAsDataURL(file);
	};

	return (
		<div className='flex p-4 items-start gap-4 border-b border-gray-700'>
			<div className='avatar'>
				<div className='w-8 rounded-full'>
					<img src={userData?.data.user?.profileImage?.url || "/avatar-placeholder.png"} />
				</div>
			</div>
			<form className='flex flex-col gap-2 w-full' onSubmit={handleSubmit}>
				<textarea
					className='textarea bg-black w-full p-0 text-lg resize-none border-none focus:outline-none  '
					placeholder='What is happening?!'
					value={text}
					onChange={(e) => setText(e.target.value)}
				/>
				{img && (
					<div className='relative w-72 mx-auto'>
						<IoCloseSharp
							className='absolute top-0 right-0 text-white bg-gray-800 rounded-full w-5 h-5 cursor-pointer'
							onClick={() => {
								setImg(null);
								if (imgRef.current) {
									imgRef.current.value = ''
								}

							}}
						/>
						<img src={img} className='w-full mx-auto h-72 object-contain rounded' />
					</div>
				)}

				<div className='flex justify-between border-t py-2 border-t-gray-700'>
					<div className='flex gap-1 items-center'>
						<CiImageOn
							className='fill-primary w-6 h-6 cursor-pointer'
							onClick={() => imgRef.current?.click()}
						/>
						<BsEmojiSmileFill className='fill-primary w-5 h-5 cursor-pointer' />
					</div>
					<input type='file' hidden ref={imgRef} onChange={handleImgChange} />
					<button type="submit" className='btn btn-primary rounded-full btn-sm text-white px-4'>
						{isPending ? "Posting..." : "Post"}
					</button>
				</div>
				{isError && <div className='text-red-500'>{error?.message}</div>}
			</form>
		</div>
	);
};
export default Createpost;