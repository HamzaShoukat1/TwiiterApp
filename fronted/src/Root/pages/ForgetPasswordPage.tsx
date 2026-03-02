import { useMutation } from '@tanstack/react-query';
import { forgetPassword } from '../../Apis.tsx';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { ArrowLeft, Loader, Mail } from 'lucide-react';
import { useState } from 'react';
export default function ForgetPasswordPage() {
    const [email, setemail] = useState("")
    const [isSubmitted, setisSubmitted] = useState(false)

    const { mutate: forgetPasswordMutate, isPending, isError, error } = useMutation({
        mutationFn: forgetPassword,
        onSuccess: () => {
            toast.success("Password reset link sent to your email");
            setisSubmitted(true)

        },
        onError: (err) => {
            console.error("Password reset email send failed");

            if (err instanceof Error) {
                toast.error(err.message);


            }
        },
    });
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        forgetPasswordMutate({ email })


    }

    return (
        <div className='min-h-screen flex justify-center items-center'>
            <div className='max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden'>
                <div className='p-8'>
                    <h2 className='text-3xl font-bold mb-6 text-center bg-linear-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text'>
                        Forgot Password
                    </h2>

                    {!isSubmitted ? (
                        <form onSubmit={handleSubmit}>
                            <p className='text-gray-300 mb-6 text-center'>
                                Enter your email address and we'll send you a link to reset your password.
                            </p>

                            <div className='relative  '>
                                <Mail className='absolute   w-4 top-1/2 transform -translate-y-1/2 text-gray-400' />
                                <input
                                    type="email"
                                    className="grow   border w-full py-3 px-4 outline-none focus:outline-none focus:ring-0"
                                    placeholder="email address"
                                    name="password"
                                    onChange={(e) => setemail(e.target.value)}
                                    value={email}
                                    required
                                />
                            </div>
                            <button
                                className='w-full py-3 mt-4 cursor-pointer px-4 bg-linear-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200'
                                type='submit'
                            >
                                {isPending ? <Loader className='size-6 animate-spin mx-auto' /> : "Send Reset Link"}
                            </button>
                            {isError && (
                                <p className='text-red-500 font-semibold mt-2'>
                                    {(error as Error)?.message || "password send failed"}
                                </p>
                            )}

                        </form>
                    ) : (
                        <div className='text-center'>
                            <div className='w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4'>
                                <Mail className='h-8 w-8 text-white' />
                            </div>
                            <p className='text-gray-300 mb-6'>
                                If an account exists for {email}, you will receive a password reset link shortly.
                            </p>
                        </div>
                    )}

                </div>

                <div className='px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center'>
                    <Link to={"/sign-in"} className='text-sm text-green-400 hover:underline flex items-center'>
                        <ArrowLeft className='h-4 w-4 mr-2' /> Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
}