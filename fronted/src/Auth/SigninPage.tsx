import { MdOutlineMail } from "react-icons/md";
import { MdPassword } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { useState, type FormEvent } from "react";
import { signin } from "../Apis.tsx/index.ts";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import LoadingSpinner from "../components/LoadingSpinner.tsx";
import { useAppDispatch } from "../hooks/useStore.ts";
import { type LoginResponse, userinfo } from "../Store/AuthSlice.ts";

export default function SigninPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [formData, setformData] = useState({
    email: "",
    password: "",
  });

  const { mutate: Signin, isPending, isError, error } = useMutation<
    LoginResponse,
    Error,
    { email: string; password: string }
  >({
    mutationFn: signin,
    onSuccess: (userData) => {
      const isVerified = userData?.data?.user?.isVerified;
      if (!isVerified) {
        navigate("/verify-email");
        return;
      }

      toast.success("Login successful");
      dispatch(userinfo(userData));
      navigate("/");
    },
    onError: (err) => {
      if (err.message.startsWith("Too many requests")) {
        toast.error(err.message);
      } else {
        toast.error(err.message);

      }
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    Signin(formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setformData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-h-screen m-auto flex  grow">
      <div className="flex-1 flex-col flex h-screen  justify-center items-center">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <h1 className="text-4xl font-extrabold text-white">Let’s go.</h1>

          <label className="input input-bordered rounded flex items-center gap-2 w-full
                            focus-within:border-base-500 focus-within:outline-none focus-within:ring-0">
            <MdOutlineMail />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              className="grow border-none outline-none  placeholder-gray-400 focus:outline-none focus:ring-0"
            />
          </label>

          <label className="input input-bordered rounded flex items-center gap-2
                            focus-within:border-base-500 focus-within:outline-none focus-within:ring-0">
            <MdPassword />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              className="grow border-none placeholder:gray-400 outline-none focus:outline-none focus:ring-0"
              required
            />
          </label>

          <Link to="/forget-password">
            <p className="text-white cursor-pointer">Forgot password?</p>
          </Link>

          <button
            type="submit"
            disabled={isPending}
            className={`btn bg-gray-700  rounded-full btn-primary text-white ${isPending &&
              "bg-gray-700 cursor-not-allowed"
              }`}
          >
            {isPending ? <LoadingSpinner /> : "Sign In"}
          </button>

          {isError && error instanceof Error && (
            <p className="text-red-500 text-xs">{error.message}</p>
          )}
        </form>


        <div className="flex gap-3  mt-3">
          <p className="text-white text-xs">Don’t have an account?</p>
          <span className="text-sm">
            <Link to="/sign-up">
              <p className="">Sign up</p>
            </Link>
          </span>
        </div>

      </div>


    </div>

  );
}