
import { MdOutlineMail } from "react-icons/md";
import { MdPassword } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { useState, type FormEvent } from "react";
import { signin } from "../mutationsAndQueries.tsx";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import LoadingSpinner from "../components/LoadingSpinner.tsx";



export default function SignupPage() {
  const navigate = useNavigate()
  const [formData, setformData] = useState({
    email: "",
    password: "",
  })
  const {mutate:Signin,isPending,isError,error} = useMutation({
    mutationFn: signin,
    onSuccess: () => {
      toast.success("login  successfully");
      navigate("/");
    },
    onError: (error) => {
      if (error instanceof Error) toast.error(error.message);
      else toast.error("login  failed");
    },
  })
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    Signin(formData)

  }
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setformData({ ...formData, [e.target.name]: e.target.value })

  }
  return (
    <div className="max-h-screen m-auto flex h-screen ">

      <div className='flex-1 flex flex-col justify-center items-center'>
        <form className="lg:w-2/3 md:mx-20 flex gap-4 flex-col" onSubmit={handleSubmit}>
          <h1 className='text-4xl font-extrabold text-white'>let's go.</h1>



          <label
            className="input input-bordered rounded flex items-center gap-2 w-full
             focus-within:border-base-500
             focus-within:outline-none
             focus-within:ring-0">
            <MdOutlineMail />

            <input
              type="email"
              className="grow border-none outline-none w-full focus:outline-none focus:ring-0"
              placeholder="email"
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
          <button type="submit" className='btn rounded-full btn-primary text-white'>{isPending ? (<LoadingSpinner />) : "Signin"}</button>
          {isError && error instanceof Error && <p className='text-red-500 text-xs' >{error.message}</p>}








        </form>

        <div className='flex  lg:w-2/3 gap-1 mt-3' >
          <p className='text-white text-xs'>Create an Account?</p>
          <span className="text-sm">
            <Link to="/sign-up"><p>Sign up</p></Link>
          </span>

        </div>


      </div>


    </div>
  )
}
