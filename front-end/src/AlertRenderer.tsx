"use client";
import React from "react";
import { useAlert } from "./AlertContext";

const AlertRenderer = () => {
  const { alert } = useAlert();

  if (!alert) return null;

  return (
    <div
      className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded shadow-lg text-white text-sm z-50
        ${alert.type === "success" ? "bg-green-500" : "bg-red-500"}`}
    >
      {alert.message}
    </div>
  );
};

export default AlertRenderer;
