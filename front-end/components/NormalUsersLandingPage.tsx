"use client";
import React from "react";
import { useAppContext } from "../src/AppContext";
import { useRouter } from "next/navigation";
import { Film, MapPin, Ticket } from "lucide-react"; // icons from lucide-react

const NormalUsersLandingPage = () => {
  const router = useRouter();
  const { user } = useAppContext();
  const userFirstname = user?.firstname ?? "";

  const actions = [
    {
      label: "Cinema Locations",
      icon: <MapPin className="h-6 w- text-blue-600" />,
      onClick: () => router.push("view-all-cinema-locations"),
    },
    {
      label: "My Bookings",
      icon: <Ticket className="h-6 w-6 text-blue-600" />,
      onClick: () => router.push("my-bookings"),
    },
  ];

  return (
    <div className="flex flex-col items-center px-4 pt-6 sm:pt-10 mx-auto max-w-screen-lg">
      <h1 className="text-2xl sm:text-4xl font-bold mb-2 text-center">
        Welcome, {userFirstname}!
      </h1>
      <p className="text-md sm:text-lg text-gray-600 mb-8 text-center">
        What would you like to do today?
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full px-10 sm:px-8">
        {actions.map((action) => (
          <button
            key={action.label}
            onClick={action.onClick}
            className="flex items-center justify-start gap-4 p-6 border rounded-2xl shadow hover:shadow-lg transition-all bg-white hover:bg-blue-50"
          >
            {action.icon}
            <span className="text-lg font-medium text-gray-800">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default NormalUsersLandingPage;
