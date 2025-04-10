"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAppContext } from "../src/AppContext";
import { useAlert } from "../src/AlertContext";

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
    <div className="bg-gray-800 text-white p-4 sm:p-6 flex justify-between items-center shadow-md">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl sm:text-2xl font-bold">
          <button
            onClick={() =>
              router.push(user.role === "admin" ? "/admin-landing-page" : "/homepage")
            }
            className="hover:text-blue-400 transition"
          >
            My Dashboard
          </button>
        </h1>
      </div>
      <div className="flex items-center space-x-4">
        <Link href="/profile" className="text-sm sm:text-base hover:text-blue-400 transition">
          View {user.firstname}'s Profile
        </Link>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm sm:text-base"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default DashboardBar;
