import { CiImageOn } from "react-icons/ci";
import { BsEmojiSmileFill } from "react-icons/bs";
import React, {  useRef, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { fetchAuthUser } from "../../../CurrentUser";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const CreatePost = () => {
	const [text, setText] = useState("");
	const [img, setImg] = useState<string | null>(null);
	const imgRef = useRef<HTMLInputElement | null>(null);

	// Fetch current user
	const { data: authUser } = useQuery({
		queryKey: ["authUser"],
		queryFn: () => fetchAuthUser()
	});
	console.log(authUser)
	const queryClient = useQueryClient()
	const { mutate: CreatePost, isError, isPending, error } = useMutation({
		mutationFn: async () => {
			const formData = new FormData()

			formData.append("text",text)

			if(imgRef.current?.files?.[0]){
				formData.append("postimg",imgRef.current?.files?.[0])
			}
			try {
				const res = await fetch("/api/v1/post/create", {
					method: "POST",
					body: formData
				})

				const data = await res.json()
				if (!res.ok) throw new Error(data.message || "post creation failed")
				console.log(data)
				return data

			} catch (error) {
				if (error instanceof Error) {
					console.error(error)
					throw error
				} else {
					throw new Error("Something went wrong while")
				}



			};

		},
		onSuccess: () => {
			setText('')
			setImg(null)
			toast.success("post created successfully")
			queryClient.invalidateQueries({ queryKey: ['posts'] })

		},
		onError: (error) => {
			if (error instanceof Error) {
				toast.error(error.message)
			} else {
				toast.error("Post creation creation failed")
			}
		}
	})
	console.log(CreatePost)

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!text.trim() && !img) {
			toast.error("Post cannot be empty");
			return
		}
		CreatePost()
	};

	const handleImgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (!file) return;
		const reader = new FileReader();
		reader.onload = () => {
			setImg(reader.result as string);
			    console.log("🖼 Base64 image result:", reader.result);
    console.log("🖼 Base64 type:", typeof reader.result);
		}
		reader.readAsDataURL(file);
	};

	return (
		<div className='flex p-4 items-start gap-4 border-b border-gray-700'>
			<div className='avatar'>
				<div className='w-8 rounded-full'>
					<img src={authUser.profileImage || "/avatar-placeholder.png"} />
				</div>
			</div>
			<form className='flex flex-col gap-2 w-full' onSubmit={handleSubmit}>
				<textarea
					className='textarea w-full p-0 text-lg resize-none border-none focus:outline-none  border-gray-800'
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
						<img src={img.url.toSting()} className='w-full mx-auto h-72 object-contain rounded'   />
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
				{isError && <div className='text-red-500'>{error.message}</div>}
			</form>
		</div>
	);
};
export default CreatePost;