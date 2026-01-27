
import { MdOutlineMail } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { MdPassword } from "react-icons/md";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { useState, type FormEvent } from "react";
import { signup } from "../Apis.tsx/index.ts";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import LoadingSpinner from "../components/LoadingSpinner.tsx";
// http://localhost:8003/api/v1/auth/signup 


export default function SignupPage() {
  const navigate = useNavigate()
  const [formData, setformData] = useState({
    email: "",
    username: "",
    fullName: "",
    password: "",
  })

  const {mutate:Signup,isPending,isError,error} = useMutation({
    mutationFn: signup,
    onSuccess: () => {
      toast.success("Account created successfully");
      navigate("/");
    },
    onError: (error) => {
      if (error instanceof Error) toast.error(error.message);
      else toast.error("Account creation failed");
    },
  })





  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    Signup(formData)
  }
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setformData({ ...formData, [e.target.name]: e.target.value })

  }
  return (
    <div className="max-h-screen m-auto flex h-screen ">

      <div className='flex-1 flex flex-col justify-center items-center'>
        <form className="lg:w-2/3 md:mx-20 flex gap-4 flex-col" onSubmit={handleSubmit}>
          <h1 className='text-4xl font-extrabold text-white'>Join today.</h1>
          <label
            className="input input-bordered rounded flex items-center gap-2
             focus-within:border-base-500
             focus-within:outline-none
             focus-within:ring-0">
            <MdOutlineMail />

            <input
              type="email"
              className="grow border-none outline-none focus:outline-none focus:ring-0"
              placeholder="Email"
              name="email"
              onChange={handleInputChange}
              value={formData.email}
            />
          </label>
          <label
            className="input input-bordered rounded flex items-center gap-2
             focus-within:border-base-500
             focus-within:outline-none
             focus-within:ring-0">
            <FaUser />

            <input
              type="text"
              className="grow border-none outline-none focus:outline-none focus:ring-0"
              placeholder="username"
              name="username"
              onChange={handleInputChange}
              value={formData.username}
            />
          </label>

          <label
            className="input input-bordered rounded flex items-center gap-2
             focus-within:border-base-500
             focus-within:outline-none
             focus-within:ring-0">
            <MdDriveFileRenameOutline />

            <input
              type="text"
              className="grow border-none outline-none focus:outline-none focus:ring-0"
              placeholder="fullName"
              name="fullName"
              onChange={handleInputChange}
              value={formData.fullName}
            />
          </label>
          <label
            className="input input-bordered rounded flex items-center gap-2
             focus-within:border-base-500
             focus-within:outline-none
             focus-within:ring-0">
            <MdPassword />

            <input
              type="password"
              className="grow border-none outline-none focus:outline-none focus:ring-0"
              placeholder="password"
              name="password"
              onChange={handleInputChange}
              value={formData.password}
            />
          </label>
          <button type="submit" className='btn rounded-full btn-primary text-white'>{isPending ? (<LoadingSpinner />): "Sign up"}</button>
          {isError && error instanceof Error && <p className='text-red-500 text-xs' >{error.message}</p>}








        </form>

        <div className='flex  lg:w-2/3 gap-1 mt-3' >
          <p className='text-white text-xs'>Already have an account?</p>
          <span className="text-sm">
            <Link to="/sign-in"><p>Sign in</p></Link>
          </span>

        </div>


      </div>


    </div>
  )
}

