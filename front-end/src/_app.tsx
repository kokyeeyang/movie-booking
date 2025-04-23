import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { AppProvider } from "./AppContext";
import AlertProvider from "./AlertContext";
import Alert from "../components/Alert";
import DashboardBar from "../components/DashboardBar";
import Cookies from "js-cookie";
import {jwtDecode} from "jwt-decode";

interface JwtPayload {
  user: {
    userId: string;
    role: string;
  };
}

function MyApp({ Component, pageProps }: { Component: any; pageProps: any }) {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Define routes that should NOT show DashboardBar
  const pathsWithoutDashboard = ["/login", "/sign-up", "/verify-email"];

  useEffect(() => {
    const handleRootRedirect = () => {
      const token = Cookies.get("accessToken");

      if (!token) {
        if (router.pathname === "/") {
          router.replace("/login");
        }
        setCheckingAuth(false);
        return;
      }

      try {
        const decoded = jwtDecode<JwtPayload>(token);

        if (router.pathname === "/") {
          if (decoded.user.role === "admin") {
            router.replace("/admin-landing-page");
          } else {
            router.replace("/homepage");
          }
        }
      } catch (err) {
        console.error("JWT decode failed", err);
        router.replace("/login");
      } finally {
        setCheckingAuth(false);
      }
    };

    handleRootRedirect();
  }, [router]);

  if (checkingAuth && router.pathname === "/") {
    return null; // Prevent rendering during redirect
  }

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
