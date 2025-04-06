"use client";
import React from "react";
import AppProvider from "../src/AppContext"; // Import AppProvider
import AlertProvider from "../src/AlertContext";
import DashboardBarComponent from "components/DashboardBar";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AlertProvider>
          <AppProvider>  {/* Wrap the whole app with AppProvider */}
            <DashboardBarComponent />  {/* This is for the whole app */}
            {children}
          </AppProvider>
        </AlertProvider>
      </body>
    </html>
  );
}