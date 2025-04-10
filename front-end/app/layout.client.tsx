"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import DashboardBar from "../components/DashboardBar";

export default function RootLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isNotFound, setIsNotFound] = useState(false);

  // Detect if the children contain a 404 page
  useEffect(() => {
    const notFoundDetected =
      typeof document !== "undefined" &&
      document.title.includes("404") || // works if your 404 title includes 404
      document.body.innerText.includes("This page could not be found"); // default message from Next.js

    setIsNotFound(notFoundDetected);
  }, [pathname]);

  const shouldShowDashboardBar =
    pathname !== "/login" && !isNotFound;

  return (
    <>
      {shouldShowDashboardBar && <DashboardBar />}
      {children}
    </>
  );
}
