import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";

type User = {
  id: string;
  isVerified:boolean;
  role: string;
  firstname: string;
  lastname: string;
  email: string;
};

type AppContextType = {
  backendDomain: string;
  setBackendDomain: (domain: string) => void;
  frontendDomain: string;
  setFrontendDomain: (domain: string) => void;
  isLoading: boolean;
  user: User | null;
  setUser: (user: User | null) => void;
  saveUser: (userData: User) => void;
};

// const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppContext = createContext<AppContextType | undefined>(undefined);

type AppProviderProps = {
  children: ReactNode;
};

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const isLocal = process.env.NODE_ENV === "development";

  const initialBackendDomain = isLocal 
    ? process.env.NEXT_PUBLIC_BACKEND_URL_LOCAL || "http://localhost:5000" 
    : process.env.NEXT_PUBLIC_BACKEND_URL;

  const initialFrontendDomain = isLocal
    ? process.env.NEXT_PUBLIC_FRONTEND_URL_LOCAL || "http://localhost:3000"
    : process.env.NEXT_PUBLIC_FRONTEND_URL;

  const [backendDomain, setBackendDomain] = useState<string>(initialBackendDomain || "");
  const [frontendDomain, setFrontendDomain] = useState<string>(initialFrontendDomain || "");
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const saveUser = (userData: User) => {
    console.log("Saving user data in context:", userData);
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const loadUser = () => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser) as User);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <AppContext.Provider
      value={{
        backendDomain,
        setBackendDomain,
        frontendDomain,
        setFrontendDomain,
        isLoading,
        user,
        setUser,
        saveUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};