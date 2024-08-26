import React, { createContext, useState, useContext, useEffect } from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const initialBackendDomain = "http://localhost:5000";
  const initialFrontendDomain = "http://localhost:3000";
  const [backendDomain, setBackendDomain] = useState(initialBackendDomain);
  const [frontendDomain, setFrontendDomain] = useState(initialFrontendDomain);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const saveUser = (userData) => {
    console.log("Saving user data in context:", userData);
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const loadUser = () => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
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

export const useAppContext = () => useContext(AppContext);

export { AppContext };
