"use client";
import React, { useState, useContext } from "react";
// import { useHistory } from "react-router-dom"; // Import Link from react-router-dom
import {useRouter} from "next/navigation";
import axios from "axios";
import { AppContext } from "../src/AppContext";

function SignupForm() {
  // the properties here are the names in the signup form
  const appContext = useContext(AppContext);
  const backendDomain = appContext?.backendDomain || process.env.NEXT_PUBLIC_BACKEND_URL || "https://localhost:5000";
  // const { backendDomain } = useContext(AppContext);
  // const history = useHistory();
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        backendDomain + "/api/v1/auth/sign-up",
        formData
      );

      if (response.status == 201) {
        alert("Successfully signed up!");
        router.push("/login");
      }
    } catch (error:any) {
      if (error.response && error.response.data && error.response.data.error) {
        console.log(error);
        alert(error.response.data.error);
      } else {
        alert(error);
      }
    }

    // const onSubmit = async (event: React.ChangeEvent<HTMLInputElement>) => {
    //   console.log(event);
    // };

    // onSubmit(formData);
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h4>Sign Up Form</h4>
      <div className="form-row">
        <label className="form-label" htmlFor="firstname">
          First name
        </label>
        <input
          type="text"
          className="form-input string-input"
          name="firstname"
          value={formData.firstname}
          onChange={handleChange}
        />
      </div>
      <div className="form-row">
        <label className="form-label" htmlFor="lastname">
          Last name
        </label>
        <input
          type="text"
          className="form-input string-input"
          name="lastname"
          value={formData.lastname}
          onChange={handleChange}
        />
      </div>
      <div className="form-row">
        <label htmlFor="email" className="form-label">
          Email
        </label>
        <input
          type="email"
          className="form-input email-input"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
      </div>
      <div className="form-row">
        <label htmlFor="password" className="form-label">
          Password
        </label>
        <input
          type="password"
          name="password"
          className="form-input password-input"
          value={formData.password}
          onChange={handleChange}
        />
      </div>
      <div className="form-row">
        <label htmlFor="password" className="form-label">
          Repeat Password
        </label>
        <input
          type="password"
          name="confirmPassword"
          className="form-input password-input"
          value={formData.confirmPassword}
          onChange={handleChange}
        />
      </div>
      <button type="submit" className="btn btn-block submit-btn">
        Sign Up
      </button>
    </form>
  );
}

export default SignupForm;
