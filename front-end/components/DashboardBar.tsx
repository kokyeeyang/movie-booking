"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAppContext } from "../src/AppContext";
import { useAlert } from "../src/AlertContext";
import "../styles/DashboardBar.module.css";

const DashboardBar: React.FC = () => {
  const router = useRouter();
  const { user, backendDomain } = useAppContext();
  const { showAlert } = useAlert();

  if (!user) return null;

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

  return (
    <div className="dashboard-bar">
      <div className="dashboard-bar-left">
        <h1>
          <button onClick={() => router.push(user.role === "admin" ? "/admin-landing-page" : "/homepage")}>
            My Dashboard
          </button>
        </h1>
      </div>
      <div className="dashboard-bar-right">
        <button onClick={handleLogout}>Logout</button>
        <Link href="/profile">View {user.firstname}'s Profile</Link>
      </div>
    </div>
  );
};

export default DashboardBar;
