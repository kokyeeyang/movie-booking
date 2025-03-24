import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

// Define the shape of an alert
interface Alert {
  message: string;
  type: string;
}

// Define the context value type
interface AlertContextType {
  alert: Alert | null;
  showAlert: (message: string, type: string) => void;
}

// Create context with a default undefined value
export const AlertContext = createContext<AlertContextType | undefined>(undefined);

// Custom hook for consuming the context
export const useAlert = (): AlertContextType => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
};

// Define the props for the AlertProvider
interface AlertProviderProps {
  children: ReactNode;
}

// AlertProvider component
const AlertProvider: React.FC<AlertProviderProps> = ({ children }) => {
  const [alert, setAlert] = useState<Alert | null>(null);

  const showAlert = (message: string, type: string) => {
    setAlert({ message, type });
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (alert) {
      timer = setTimeout(() => {
        setAlert(null);
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [alert]);

  return (
    <AlertContext.Provider value={{ alert, showAlert }}>
      {children}
    </AlertContext.Provider>
  );
};

export default AlertProvider;
