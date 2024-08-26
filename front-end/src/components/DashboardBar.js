import React from "react";
import { Link, useHistory } from "react-router-dom";
import { useAppContext } from "../AppContext";
import { useAlert } from "../AlertContext";
import "../styles/DashboardBar.css";

const DashboardBar = () => {
  const { user, setUser, backendDomain } = useAppContext();
  const history = useHistory();
  const { showAlert } = useAlert();
  if (!user) {
    return null;
  }
  const userFirstName = user.firstname;
  const handleLogout = () => {
    fetch(`${backendDomain}/api/v1/auth/logout`, {
      method: "DELETE",
      credentials: "include",
    }).then((response) => {
      if (response.ok) {
        localStorage.removeItem("user");
        showAlert("logged out successfully", "success");
        history.push("login");
      } else {
        alert("something went wrong with logging out");
      }
    });
  };

  const redirectToLandingPage = () => {
    if (user.role === "admin") {
      history.push("admin-landing-page");
    } else if (user.role === "user") {
      history.push("homepage");
    }
  };
  console.log("helllloooo i am here!");

  return (
    <div className="dashboard-bar">
      <div className="dashboard-bar-left">
        <h1>
          <button onClick={redirectToLandingPage}>My Dashboard</button>
        </h1>
      </div>
      <div className="dashboard-bar-right">
        <button onClick={handleLogout}>Logout</button>
        <Link to="/profile">View {userFirstName}'s Profile</Link>
      </div>
    </div>
  );
};

export default DashboardBar;
