import { useState, useContext, ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import {useRouter} from "next/navigation";
import axios from "axios";
import { AppContext } from "../src/AppContext";
import { useAlert } from "../src/AlertContext";

interface LoginFormProps {
  onSubmit?: (user:any) => void;
}
const LoginForm = ({onSubmit} : LoginFormProps) => {
  const appContext = useContext(AppContext);
  const backendDomain = appContext?.backendDomain || "http://localhost:5000";
  // const { saveUser, backendDomain } = useContext(AppContext);
  const router = useRouter();
  const [values, setValues] = useState({
    email: "",
    password: "",
  });
  // const { backendDomain } = useContext(AppContext);
  const { showAlert } = useAlert();
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };
  const loginUser = async (email: string, password: string) => {
    try {
      if (email && password) {
        const login = { email, password };
        const data = await axios.post(
          `${backendDomain}/api/v1/auth/login`,
          login,
          { withCredentials: true }
        );
        // console.log(data.data.user.role);
        showAlert("Logged in successfully!", "success");
        appContext?.setUser(data.data.user);
        if (data.data.user.role === "user") {
          router.push("/homepage");
        } else if (data.data.user.role === "admin") {
          router.push("/admin-landing-page");
        }
        return data.data.user;
      }
      // onSubmit(user);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    console.log("byeee");
    e.preventDefault();

    try {
      console.log('wqeqeqeq');
      const user = await loginUser(values.email, values.password);
    } catch (error) {
      console.error("Login failed:", error);
      showAlert("Login failed. Please try again.", "error");
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h4>login form</h4>
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
        submit
      </button>
      <p>
        Don't have an account? <Link href="/sign-up">Sign up</Link>
      </p>
    </form>
  );
}

export default LoginForm;
