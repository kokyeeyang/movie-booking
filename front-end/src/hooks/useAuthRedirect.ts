"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  user: {
    userId: string;
    role: string;
  };
}

export default function useAuthRedirect(protectedRole: "admin" | "user" | null) {
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return; // Wait for hydration to complete

    const checkAuth = () => {
      const token = Cookies.get("accessToken"); // Fetch token from cookies
      console.log("TOKEN FOUND:", token);

      if (!token) {
        // If no token, redirect to login page
        if (window.location.pathname !== "/login") {
          console.log("No token, redirecting to login");
          router.replace("/login");
        }
        return;
      }

      try {
        const decoded = jwtDecode<JwtPayload>(token);
        const currentPath = window.location.pathname;
        console.log("DECODED TOKEN:", decoded, "Current path:", currentPath);

        if (currentPath === "/") {
          if (decoded.user.role === "admin") {
            router.replace("/admin-landing-page");
          } else {
            router.replace("/homepage");
          }
          return;
        }

        if (protectedRole && decoded.user.role !== protectedRole) {
          console.log("Wrong role, redirecting");
          if (decoded.user.role === "admin") {
            router.replace("/admin-landing-page");
          } else {
            router.replace("/homepage");
          }
        }
      } catch (err) {
        console.error("JWT decode failed", err);
        router.replace("/login");
      }
    };

    checkAuth();
  }, [hydrated, router, protectedRole]);
}
