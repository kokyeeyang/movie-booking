"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import axios from "axios";

const backendDomain = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function useAuthRedirect(protectedRole: "admin" | "user" | null) {
  const router = useRouter();
  const pathname = usePathname(); // ✅ this replaces window.location.pathname
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    const checkAuth = async () => {
      try {
        console.log("Running auth redirect check. Current pathname:", pathname);
        const res = await axios.get(`${backendDomain}/api/v1/auth/me`, {
          withCredentials: true,
        });

        const user = res.data.user;
        console.log("Authenticated user:", user);

        if (pathname === "/") {
          router.replace(user.role === "admin" ? "/admin-landing-page" : "/homepage");
          return;
        }

        if (protectedRole && user.role !== protectedRole) {
          router.replace(user.role === "admin" ? "/admin-landing-page" : "/homepage");
        }

      } catch (err) {
        console.error("Auth check failed:", err);

        if (pathname === "/") {
          router.replace("/login"); // send unauthenticated users to login from root
        } else {
          router.replace("/login");
        }
      }
    };

    checkAuth();
  }, [hydrated, pathname, router, protectedRole]);
}
