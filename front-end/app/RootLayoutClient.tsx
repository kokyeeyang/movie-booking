"use client";
import { useEffect } from "react";
import DashboardBar from "../components/DashboardBar";
import { usePathname } from 'next/navigation';

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  const shouldShowDashboardBar = pathname && pathname !== "/login";

  useEffect(() => {
    console.log("🏷️ pathname:", pathname);
    console.log("✅ shouldShowDashboardBar:", shouldShowDashboardBar);
  }, [pathname]);

  return (
    <>
      {shouldShowDashboardBar && (
        <DashboardBar />
        )}
      {children}
    </>
  );
}
