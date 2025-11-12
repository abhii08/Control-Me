import { useState, type ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom"
import axios from 'axios';
import { BACKEND_URL } from "../config";
import type { SignupInput } from "../types";
import { signupInput, signinInput } from "../schemas/validation";


/**
 * Auth Component - Handles user authentication (signup and signin)
 */
export const Auth = ({ type }: { type: "signup" | "signin" }) => {
    const navigate = useNavigate();
    const [postInputs, setPostInputs] = useState<SignupInput>({
        name:"",
        email:"",
        password: ""
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);

    async function sendRequest(){
        setErrors({});
        
        // Use different validation schema for signup vs signin
        const schema = type === "signup" ? signupInput : signinInput;
        const validation = schema.safeParse(postInputs);
        
        if (!validation.success) {
            // Convert Zod errors to field-specific error messages
            const fieldErrors: Record<string, string> = {};
            validation.error.issues.forEach((error: any) => {
                if (error.path[0]) {
                    fieldErrors[error.path[0] as string] = error.message;
                }
            });
            setErrors(fieldErrors);
            return;
        }

        setIsLoading(true);
        try{
            const response = await axios.post(`${BACKEND_URL}/api/v1/auth/${type === "signup" ? "signup" : "signin"}`, validation.data);
            const jwt = response.data;
            localStorage.setItem("token", jwt);
            navigate("/profile");
        }catch(e: any){
            if (e.response?.data?.errors) {
                // Handle backend validation errors
                const backendErrors: Record<string, string> = {};
                Object.keys(e.response.data.errors).forEach(key => {
                    backendErrors[key] = e.response.data.errors[key]._errors?.[0] || "Invalid input";
                });
                setErrors(backendErrors);
            } else {
                setErrors({ general: e.response?.data?.message || "Error while signing in" });
            }
        } finally {
            setIsLoading(false);
        }
    }

    return <div className="h-screen flex justify-center flex-col">
        <div className="flex justify-center">
          <div>
            <div className="px-10">
                <div className="text-3xl font-extrabold">
                    {type === "signup" ? "Create an account" : "Sign in to your account"}
                </div>
                <div className="text-slate-500">
                    { type === "signin" ? "Don't have an account?" : "Already have an account?"}
                    <Link className="pl-2 underline" to={type === "signin" ? "/" : "/signin"}>
                        {type === "signin" ? "Sign up" : "Sign in"}
                    </Link>
                </div>
            </div>
            <div className="pt-8">
                {errors.general && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        {errors.general}
                    </div>
                )}
                
                {type === "signup" ? <LabelledInput 
                    label="Name" 
                    placeholder="Abhinav Sharma..." 
                    error={errors.name}
                    onChange={(e) => {
                        setPostInputs({
                             ...postInputs,
                             name: e.target.value
                        });
                        // Clear error when user starts typing
                        if (errors.name) {
                            setErrors({...errors, name: ""});
                        }
                    }} 
                /> : null} 
                
                <LabelledInput 
                    label="Email" 
                    placeholder="abhinav@gmail.com" 
                    error={errors.email}
                    onChange={(e) => {
                        setPostInputs({
                            ...postInputs,
                            email: e.target.value
                        });
                        // Clear error when user starts typing
                        if (errors.email) {
                            setErrors({...errors, email: ""});
                        }
                    }}
                />
                
                <LabelledInput 
                    label="Password" 
                    type={"password"} 
                    placeholder="123456" 
                    error={errors.password}
                    onChange={(e) => {
                        setPostInputs({
                            ...postInputs,
                            password: e.target.value
                        });
                        // Clear error when user starts typing
                        if (errors.password) {
                            setErrors({...errors, password: ""});
                        }
                    }}
                />
                
                <button 
                    onClick={sendRequest} 
                    disabled={isLoading}
                    type="button" 
                    className={`mt-8 w-full text-white font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 ${
                        isLoading 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700'
                    }`}
                >
                    {isLoading ? "Loading..." : (type === "signup" ? "Sign up" : "Sign in")}
                </button>

            </div>
          </div>
        </div>

    </div>
}   
interface LabbledInputType {
    label: string;
    placeholder: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    type?: string;
    error?: string;
}

function LabelledInput({label, placeholder, onChange, type, error }:LabbledInputType) {
    return <div>
        <label className="block mb-2 text-sm text-black text-bold font-semibold pt-4">{label}</label>
        <input 
            onChange={onChange} 
            type={type||"text"} 
            className={`bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${
                error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300'
            }`}
            placeholder={placeholder} 
            required 
        />
        {error && (
            <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
    </div>
}