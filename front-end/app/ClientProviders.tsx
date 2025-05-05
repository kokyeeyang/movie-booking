"use client";

import { AppProvider } from "../src/AppContext";
import AlertProvider from "../src/AlertContext";
import { ThemeProvider } from "next-themes";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <AppProvider>
        <AlertProvider>
          {children}
        </AlertProvider>
      </AppProvider>
    </ThemeProvider>
  );
}
