import { useState, useContext, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { AppContext } from "../AppContext";
import { useAlert } from "../AlertContext";
import Link from "next/link";

interface User {
  id: string;
  email: string;
  role: "user" | "admin";
}
interface LoginFormProps {
  onSubmit?: (user: User) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
  const appContext = useContext(AppContext);
  const {saveUser, backendDomain = "http://localhost:5000"} = appContext || {};
  const router = useRouter();
  const { showAlert } = useAlert();

  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const loginUser = async (email: string, password: string) => {
    try {
      if (email && password) {
        const login = { email, password };
        const { data } = await axios.post(
          `${backendDomain}/api/v1/auth/login`,
          login,
          { withCredentials: true }
        );

        if(saveUser){
          showAlert("Logged in successfully!", "success");
          saveUser(data.data.user);
        }
        
        if (data.data.user.role === "user") {
          router.push({
            pathname: "/homepage",
            query: {data: JSON.stringify(data.data.user)}
          })
        } else if (data.data.user.role === "admin") {
          router.push({
            pathname: "/admin-landing-page",
            query: {data:JSON.stringify(data.data.user)}
          })
        }
        return data.data.user;
      }
    } catch (error) {
      console.error("Login failed:", error);
      showAlert("Login failed. Please try again.", "error");
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await loginUser(values.email, values.password);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h4>Login Form</h4>
      <div className="form-row">
        <label htmlFor="email" className="form-label">
          Email
        </label>
        <input
          type="email"
          className="form-input email-input"
          name="email"
          value={values.email}
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
          value={values.password}
          onChange={handleChange}
        />
      </div>
      <button type="submit" className="btn btn-block submit-btn">
        Submit
      </button>
      <p>
        Don't have an account? <Link href="/sign-up">Sign up</Link>
      </p>
    </form>
  );
};

export default LoginForm;
