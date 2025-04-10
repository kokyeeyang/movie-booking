"use client";

import { AppProvider } from "../src/AppContext";
import AlertProvider from "../src/AlertContext";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      <AlertProvider>
        {children}
      </AlertProvider>
    </AppProvider>
  );
}
