
import React from "react";
import { useForm } from "react-hook-form";


import { fetchData } from "../config/methods"



import { MethodHeaders } from "../config/api"
import { setToken } from "../utils/utils"
import { useRouter } from "next/router";
import { toast } from "react-toastify";






interface SignUpFormData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}


export default function SignUp({ setisSignUp }) {

    const router = useRouter()
    const { register, handleSubmit, watch, formState: { errors } } = useForm<SignUpFormData>();

    const onSubmit = async (data: SignUpFormData) => {
        console.log("SignUp Data:", data);


        const SignUpMethod = MethodHeaders.SIGNUP
        const response = await fetchData(
            SignUpMethod.URL,
            { method: SignUpMethod.method, data },
            SignUpMethod.options
        )

        console.log("response", response)
        if (response.token) {
            setToken(response.token)
            toast.success("Loggin In")
            router.push("/dashboard")
        }




    };

    return (
        <div className="w-full max-w-xs mx-auto mt-10">
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-center text-2xl font-bold mb-6">Sign Up</h2>

                <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                    <input
                        type="text"
                        id="name"
                        {...register("name", { required: "Name is required" })}
                        className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                        placeholder="Enter your full name"
                    />
                    {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                </div>

                <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        id="email"
                        {...register("email", { required: "Email is required", pattern: { value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/, message: "Invalid email format" } })}
                        className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                        placeholder="Enter your email"
                    />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                </div>

                <div className="mb-4">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                    <input
                        type="password"
                        id="password"
                        {...register("password", { required: "Password is required", minLength: { value: 6, message: "Password must be at least 6 characters" } })}
                        className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                        placeholder="Enter your password"
                    />
                    {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                </div>

                <div className="mb-4">
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        {...register("confirmPassword", {
                            required: "Confirm Password is required",
                            validate: (value) => value === watch('password') || "Passwords don't match",
                        })}
                        className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                        placeholder="Confirm your password"
                    />
                    {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
                </div>

                <div className="mb-4">
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Sign Up
                    </button>
                </div>
            </form>

            <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                    Already have an account?{" "}
                    <span className="text-blue-600 hover:underline cursor-pointer" onClick={() => setisSignUp(false)}>
                        Log in
                    </span>
                </p>
            </div>
        </div>
    );
};

