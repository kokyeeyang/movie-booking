"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import DashboardBar from "../components/DashboardBar";

export default function RootLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return null; // Prevent premature rendering before hydration

  const noDashboardBarArray = ['/login', '/sign-up', '/ticket-page', '/verify-email'];
  const shouldShowDashboardBar = !noDashboardBarArray.includes(pathname);

  return (
    <>
      {shouldShowDashboardBar && <DashboardBar />}
      {children}
    </>
  );
}
