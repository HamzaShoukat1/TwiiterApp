import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { resetPassword } from "../../Apis.tsx";

const ResetPasswordPage = () => {
    // const [newpassword, setnewpassword] = useState("");
    // const [confirmPassword, setconfirmPassword] = useState("");
    const [formData, setformData] = useState({
        newpassword: "",
        confirmPassword: ""
    })
    const navigate = useNavigate();

    const { mutate: resetPaswordmutate, isPending, isError, error } = useMutation({
        mutationFn: resetPassword,
        onSuccess: () => {
            toast.success("reset password  successfully");
            setTimeout(() => {

                navigate("/sign-in");
            }, 2000);
            setformData({
                newpassword: "",
                confirmPassword: "",
            })
        },

        onError: () => {
            console.error("reset password failed");
        },
    })

    const { token } = useParams<{ token: string }>();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!token) {
            toast.error("Invalid reset token");
            return;
        }
        resetPaswordmutate({...formData,token})


    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setformData({ ...formData, [e.target.name]: e.target.value })

    }
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-800 bg-opacity-50">
            <div className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-center bg-linear-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
                    Reset Password
                </h2>


              

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="password"
                        placeholder="New Password"
                        value={formData.newpassword}
                        name="newpassword"
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-green-500"
                        required
                    />

                    <input
                        type="password"
                        placeholder="Confirm New Password"
                        value={formData.confirmPassword}
                        name="confirmPassword"
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-green-500"
                        required
                    />
                      {isError && (
                    <p className='text-red-500 font-semibold mt-2'>
                        {(error as Error)?.message || "Verification failed"}
                    </p>
                )}

                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full py-3 cursor-pointer px-4 bg-linear-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200 disabled:opacity-50"
                    >
                        {isPending ? "Resetting..." : "Set New Password"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPasswordPage;