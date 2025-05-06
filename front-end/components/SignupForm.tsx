"use client";
import React, { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { AppContext } from "../src/AppContext";
import  { useAlert } from "../src/AlertContext";

function SignupForm() {
  const appContext = useContext(AppContext);
  const backendDomain =
    appContext?.backendDomain ||
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    "https://localhost:5000";

  const router = useRouter();
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const {showAlert} = useAlert(); 

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        backendDomain + "/api/v1/auth/sign-up",
        formData
      );

      if (response.status === 201) {
        showAlert("Successfully signed up!", "success");
        router.push("/login");
      }
    } catch (error: any) {
      if (error.response?.data?.error) {
        showAlert("Please verify your email address first", "errorr");
      } else {
        showAlert("An error occurred.", "error");
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-md space-y-6 mt-10"
    >
      <h2 className="text-2xl font-bold text-center text-gray-800">Sign Up</h2>

      <div>
        <label htmlFor="firstname" className="block text-sm font-medium text-gray-700">
          First Name
        </label>
        <input
          type="text"
          name="firstname"
          value={formData.firstname}
          onChange={handleChange}
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label htmlFor="lastname" className="block text-sm font-medium text-gray-700">
          Last Name
        </label>
        <input
          type="text"
          name="lastname"
          value={formData.lastname}
          onChange={handleChange}
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
          Repeat Password
        </label>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <button
        type="submit"
        className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md shadow hover:bg-blue-700 transition duration-200"
      >
        Sign Up
      </button>
    </form>
  );
}

export default SignupForm;
