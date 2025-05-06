"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAppContext } from "../src/AppContext";
import { useAlert } from "../src/AlertContext";
import ThemeToggle from "../components/ThemeToggle";
import { Home, User, Power } from "lucide-react";

export default function DashboardBar() {
  const router = useRouter();
  const { user, backendDomain } = useAppContext();
  const { showAlert } = useAlert();

  console.log('dashboard bar is shown!');
  console.log(user);

  const handleLogout = async () => {
    try {
      const response = await fetch(`${backendDomain}/api/v1/auth/logout`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        // localStorage.removeItem("user");
        localStorage.clear();
        alert("Logged out successfully");
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
              user && router.push(user.role === "admin" ? "/admin-landing-page" : "/homepage")
            }
            className="hover:text-blue-400 transition"
          >
            <Home size={24} />
          </button>
        </h1>
      </div>
      <div className="flex items-center space-x-4">
        <ThemeToggle />
      </div>
      {user && (
        <div className="flex items-center space-x-4">
          <Link href="/profile" className="text-sm sm:text-base hover:text-blue-400 transition">
            <User size={24} />
          </Link>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm sm:text-base"
          >
             <Power size={24} />
          </button>
        </div>
      )}
    </div>
  );
}