import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";

type User = {
  userId: string;
  isVerified: boolean;
  role: string;
  firstname: string;
  lastname: string;
  email: string;
};

export type AppContextType = {
  backendDomain: string;
  setBackendDomain: (domain: string) => void;
  frontendDomain: string;
  setFrontendDomain: (domain: string) => void;
  isLoading: boolean;
  user: User | null;
  setUser: (user: User | null) => void;
  saveUser: (userData: User) => void;
};

export const AppContext = createContext<AppContextType | undefined>(undefined);

// 🛠️ Log the value baked at build time (in final bundle)
console.log(
  "[BUILD TIME] NEXT_PUBLIC_BACKEND_URL =",
  process.env.NEXT_PUBLIC_BACKEND_URL
);

type AppProviderProps = {
  children: ReactNode;
};

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const isLocal = process.env.NODE_ENV === "development";

  // Pull from env vars embedded at build time
  const initialBackendDomain =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
  const initialFrontendDomain =
    process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000";

  const [backendDomain, setBackendDomain] = useState<string>(
    initialBackendDomain
  );
  const [frontendDomain, setFrontendDomain] = useState<string>(
    initialFrontendDomain
  );
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
    console.log("[RUNTIME] backendDomain =", backendDomain);

    // 🛠 Optional override for production (debug only)
    if (
      typeof window !== "undefined" &&
      window.location.hostname === "moviebooking.dev"
    ) {
      console.warn(
        "[RUNTIME OVERRIDE] Forcing backendDomain to https://api.moviebooking.dev"
      );
      setBackendDomain("https://api.moviebooking.dev");
    }

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
