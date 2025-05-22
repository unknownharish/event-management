import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";



import { fetchData } from "../config/methods"



import { MethodHeaders } from "../config/api"
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../redux/slice";



interface LoginFormData {
    email: string;
    password: string;
}



export default function login({ setisSignUp }) {

    const router = useRouter();
    const dispatch = useDispatch();
    const userState = useSelector(state => state?.user);


    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();


    useEffect(() => {
        if (userState?.token) {
            router.push("/events")
        }
    }, [])




    const onSubmit = async (data: LoginFormData) => {

        console.log("Login Data:", data);

        const LoginMethod = MethodHeaders.LOGIN
        const response = await fetchData(
            LoginMethod.URL,
            { method: LoginMethod.method, data },
            LoginMethod.options
        )

        console.log("response", response)
        if (response.token) {
            dispatch(setUser(response))
            // setToken(response.token)
            toast.success("Loggin In")

            // check admin
            if (response?.user?.email == process.env.NEXT_PUBLIC_ADMIN?.toString()) router.push("/dashboard")
            router.push("/events")
        }
    };

    return (
        <div className="w-full max-w-xs mx-auto mt-10">
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-center text-2xl font-bold mb-6">Login</h2>

                <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        id="email"
                        {...register("email", {
                            required: "Email is required",
                            pattern: { value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/, message: "Invalid email format" }
                        })}
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
                        {...register("password", {
                            required: "Password is required",
                            minLength: { value: 3, message: "Password must be at least 3 characters long" }
                        })}
                        className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                        placeholder="Enter your password"
                    />
                    {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                </div>

                <div className="mb-4">
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    >
                        Log In
                    </button>
                </div>
            </form>

            <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                    Don't have an account?{" "}
                    <span className="text-blue-600 hover:underline cursor-pointer" onClick={() => setisSignUp(true)}>
                        Sign up
                    </span>
                </p>
            </div>
        </div>
    );
};

