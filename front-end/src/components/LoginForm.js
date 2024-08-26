import { useState, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../AppContext";
import { useAlert } from "../AlertContext";

function LoginForm({ onSubmit }) {
  const { saveUser, backendDomain } = useContext(AppContext);
  const history = useHistory();
  const [values, setValues] = useState({
    email: "",
    password: "",
  });
  // const { backendDomain } = useContext(AppContext);
  const { showAlert } = useAlert();
  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };
  const loginUser = async (email, password) => {
    try {
      if (email && password) {
        const login = { email, password };
        const data = await axios.post(
          `${backendDomain}/api/v1/auth/login`,
          login,
          { withCredentials: true, credentials: "include" }
        );
        console.log(data);
        // console.log(data.data.user.role);
        showAlert("Logged in successfully!", "success");
        saveUser(data.data.user);
        console.log(data.data.user);
        if (data.data.user.role === "user") {
          history.push("/homepage", {
            data: JSON.stringify(data.data.user),
          });
        } else if (data.data.user.role === "admin") {
          history.push("/admin-landing-page", {
            data: JSON.stringify(data.data.user),
          });
        }
        return data.user;
      }
      // onSubmit(user);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    console.log("byeee");
    e.preventDefault();

    try {
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
        Don't have an account? <Link to="/sign-up">Sign up</Link>
      </p>
    </form>
  );
}

export default LoginForm;
