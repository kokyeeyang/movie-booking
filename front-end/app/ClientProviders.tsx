"use client";

import { AppProvider } from "../src/AppContext";
import AlertProvider from "../src/AlertContext";
import { ThemeProvider } from "next-themes";
import AlertRenderer from "@/AlertRenderer";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <AppProvider>
        <AlertProvider>
           <AlertRenderer />
          {children}
        </AlertProvider>
      </AppProvider>
    </ThemeProvider>
  );
}
