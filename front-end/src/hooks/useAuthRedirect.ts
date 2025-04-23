"use client";

import { useEffect } from "react";
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
      const userRole = decoded.user.role;

      // ❗ Redirect if role does not match
      if (protectedRole && userRole !== protectedRole) {
        console.warn("Access denied. Redirecting based on role:", userRole);
        if (userRole === "admin") {
          router.replace("/admin-landing-page");
        } else {
          router.replace("/homepage");
        }
      }
    } catch (err) {
      console.error("JWT decode failed", err);
      router.replace("/login");
    }
  }, [router, protectedRole]);
}
