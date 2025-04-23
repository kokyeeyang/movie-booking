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
    setHydrated(true); // Ensures this only runs on client
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    const token = Cookies.get("accessToken");
    console.log("TOKEN FOUND:", token);

    if (!token) {
      if (window.location.pathname !== "/login") {
        router.replace("/login");
      }
      return;
    }

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      console.log("DECODED TOKEN:", decoded);

      if (window.location.pathname === "/") {
        if (decoded.user.role === "admin") {
          router.replace("/admin-landing-page");
        } else if (decoded.user.role === "user") {
          router.replace("/homepage");
        }
        return;
      }

      if (protectedRole && decoded.user.role !== protectedRole) {
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
  }, [hydrated, router, protectedRole]);
}
