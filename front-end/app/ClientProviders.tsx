"use client";

import {ReactNode} from "react";
import AlertProvider from "../src/AlertContext";
import { AppProvider } from "../src/AppContext";

export default function ClientProviders({children} : {children: ReactNode}) {
    return (
        <AppProvider>
          <AlertProvider>
            {children}
          </AlertProvider>
        </AppProvider>
    );
}