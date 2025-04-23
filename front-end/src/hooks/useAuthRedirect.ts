"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";


const backendDomain = process.env.NEXT_PUBLIC_BACKEND_URL; // or hardcode if needed

export default function useAuthRedirect(protectedRole: "admin" | "user" | null) {
    const router = useRouter();
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        setHydrated(true);
    }, []);

    useEffect(() => {  
        if (!hydrated) return; // Prevent premature render

        const checkAuth = async () => {
            try {
                const res = await axios.get(`${backendDomain}/api/v1/auth/me`, {
                    withCredentials: true,
                });

                const user = res.data.user;
                console.log("Authenticated user:", user);

                // If on "/" path, redirect based on role
                if (window.location.pathname === "/") {
                router.replace(user.role === "admin" ? "/admin-landing-page" : "/homepage");
                return;
                }

                // If role mismatch, redirect them
                if (protectedRole && user.role !== protectedRole) {
                router.replace(user.role === "admin" ? "/admin-landing-page" : "/homepage");
                }

            } catch (err) {
                console.error("Auth check failed:", err);
                router.replace("/login");
            }
        };

        checkAuth();
    }, [hydrated,router, protectedRole]);
}
