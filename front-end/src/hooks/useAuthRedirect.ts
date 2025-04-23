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
  const [checking, setChecking] = useState(true); // New state to prevent premature redirects

  useEffect(() => {
    const token = Cookies.get("accessToken");

    if (!token) {
      if (window.location.pathname !== "/login") {
        router.replace("/login");
      }
      return;
    }

    try {
      const decoded = jwtDecode<JwtPayload>(token);

      // Redirect if on root
      if (window.location.pathname === "/") {
        if (decoded.user.role === "admin") {
          router.replace("/admin-landing-page");
        } else if (decoded.user.role === "user") {
          router.replace("/homepage");
        }
        return;
      }

      // Redirect if wrong role
      if (protectedRole && decoded.user.role !== protectedRole) {
        if (decoded.user.role === "admin") {
          router.replace("/admin-landing-page");
        } else {
          router.replace("/homepage");
        }
        return;
      }

      setChecking(false); // All good
    } catch (err) {
      console.error("Invalid token", err);
      router.replace("/login");
    }
  }, [router, protectedRole]);

  return !checking;
}
