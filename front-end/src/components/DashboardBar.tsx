import React, { useContext } from "react";
import {useRouter} from "next/navigation";
import Link from "next/link";
import { AppContext, useAppContext } from "../AppContext";
import { useAlert } from "../AlertContext";
import "../styles/DashboardBar.css";

const router = useRouter();
// Define the expected structure of the user object
interface User {
  firstname: string;
  role?: "admin" | "user"; // Restrict role to specific values
}

const DashboardBar: React.FC = () => {
  const appContext = useContext(AppContext);
  const backendDomain = appContext?.backendDomain || "https://localhost:5000";
  // const { user, backendDomain } = useAppContext();
  const {user} = useAppContext();
  const { showAlert } = useAlert();

  if (!user) {
    return null;
  }

  const userFirstName: string = user.firstname;

  const handleLogout = async () => {
    try {
      const response = await fetch(`${backendDomain}/api/v1/auth/logout`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        localStorage.removeItem("user");
        showAlert("Logged out successfully", "success");
        router.push("/login");
      } else {
        alert("Something went wrong with logging out");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const redirectToLandingPage = () => {
    if (user.role === "admin") {
      router.push("/admin-landing-page");
    } else {
      router.push("/homepage");
    }
  };

  return (
    <div className="dashboard-bar">
      <div className="dashboard-bar-left">
        <h1>
          <button onClick={redirectToLandingPage}>My Dashboard</button>
        </h1>
      </div>
      <div className="dashboard-bar-right">
        <button onClick={handleLogout}>Logout</button>
        <Link href="/profile">View {userFirstName}'s Profile</Link>
      </div>
    </div>
  );
};

export default DashboardBar;
