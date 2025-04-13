"use client";
import { useRouter } from "next/router";
import { useAppContext } from "../src/AppContext";
import { useEffect, useState } from "react";

const ProtectedRoute = ({ children, roles = []} : { children: React.ReactNode; roles?:string[]}) => {
    const { user, isLoading } = useAppContext();
    const router = useRouter();
    const [allowRender, setAllowRender] = useState(true);

    useEffect(() => {
      if (!isLoading) {
        if (!user) {
          router.replace("/login"); // Redirect to login if not authenticated
        } else if (roles.length > 0 && !roles.includes(user.role)) {
          router.replace("/homepage"); // Redirect if role is unauthorized
        } else {
          setAllowRender(true); // Allow rendering
        }
      }
    }, [user, isLoading, router]);

    if (isLoading || !allowRender) {
      return <div>Loading...</div>;
    }

    return <>{children}</>

  };

export default ProtectedRoute;
