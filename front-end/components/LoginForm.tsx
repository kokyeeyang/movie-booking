"use client";

import { useState, useContext, ChangeEvent, FormEvent, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { AppContext } from "../src/AppContext";
import { useAlert } from "../src/AlertContext";

import Cookies from "js-cookie";

interface LoginFormProps {
  onSubmit?: (user: any) => void;
}

const LoginForm = ({ onSubmit }: LoginFormProps) => {
  const appContext = useContext(AppContext);
  const backendDomain = appContext?.backendDomain || "http://localhost:5000";
  const router = useRouter();
  const [values, setValues] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const { showAlert } = useAlert();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const loginUser = async (email: string, password: string) => {
    try {
      setLoading(true);
      if (email && password) {
        console.log(email)
        const login = { email, password };
        const data = await axios.post(
          `${backendDomain}/api/v1/auth/login`,
          login,
          { withCredentials: true }
        );
        console.log("Current user:", data.data.user);
        showAlert("Logged in successfully!", "success");
        appContext?.setUser(data.data.user);
        localStorage.setItem("user", JSON.stringify(data.data.user));
        console.log("Login response data:", data.data);
        console.log("Login response data user:", data.data.user);
        if (data.data.user.role === "user") {
          router.push("/homepage");
        } else if (data.data.user.role === "admin") {
          router.push("/admin-landing-page");
        }
        return data.data.user;
      }
    } catch (error: any) {
      console.log("Error logging in:", error.response);
    
      let message = "Login failed. Please try again.";
      
      console.log(error);
      if (error) {
        console.log('hello')
        message =
          error.response.data?.msg ||
          error.response.data?.error ||
          `Login failed with status ${error.response.status}`;
      } else if (error.response.request) {
        message = "No response from server. Please check your network.";
      } else {
        // Something else happened setting up the request
        message = error.message;
      }
      console.log("here");
      showAlert(message, "error");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    console.log("document.cookie:", document.cookie);
    console.log("js-cookie accessToken:", Cookies.get("accessToken"));
  }, []);
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await loginUser(values.email, values.password);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-6 rounded-2xl shadow-md"
      >
        {loading && (
          <div className="mb-4 text-center text-sm text-blue-700 bg-blue-100 px-4 py-2 rounded-lg animate-pulse">
            Hang tight, the logging in process is taking some time...
          </div>
        )}
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Login
        </h2>

        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-600 mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={values.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium text-gray-600 mb-1">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={values.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200"
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center">
              <svg
                className="animate-spin h-5 w-5 mr-2 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
                />
              </svg>
              Signing in...
            </div>
          ) : (
            "Sign In"
          )}
        </button>

        <p className="mt-4 text-sm text-center text-gray-600">
          Don't have an account?{" "}
          <Link href="/sign-up" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;
