import React, { useEffect, useState } from "react";
// import {
//   BrowserRouter as Router,
//   Route,
//   Switch,
//   useLocation,
// } from "react-router-dom";
import { useRouter } from "next/router";
import { AppProvider, useAppContext } from "./AppContext";
import AlertProvider from "./AlertContext";
import Alert from "./components/Alert";
import DashboardBar from "./components/DashboardBar";

function MyApp({ Component, pageProps }: { Component: any; pageProps: any }) {
  const router = useRouter();

  // Define routes that should NOT show DashboardBar
  const pathsWithoutDashboard = ["/login", "/sign-up", "/verify-email"];

  return (
    <AppProvider>
      <AlertProvider>
        <Alert />
        {!pathsWithoutDashboard.includes(router.pathname) && <DashboardBar />}
        <Component {...pageProps} />
      </AlertProvider>
    </AppProvider>
  );
}

export default MyApp;
