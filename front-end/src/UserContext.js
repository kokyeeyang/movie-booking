import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { AppContext } from "./AppContext";

// Create the context
export const UserContext = createContext();

// Create a context provider component
export const UserProvider = ({ children }) => {
  // State to store the current user
  const [currentUser, setCurrentUser] = useState(null);
  console.log(useContext(AppContext));
  const { backendDomain } = useContext(AppContext);
  const loginUser = async (email, password) => {
    const login = { email, password };
    try {
      if (email && password) {
        const data = await axios.post(
          `${backendDomain}/api/v1/auth/login`,
          login
        );
        setCurrentUser(data.user);
        return data.user;
        // showAlert("Logged in successfully!", "success");
        // saveUser(data.user);
        // if (data.data.user.role === "user") {
        //   history.push("homepage", {
        //     data: JSON.stringify(data.data.user),
        //   });
        // } else if (data.data.user.role === "admin") {
        //   history.push("admin-landing-page", {
        //     data: JSON.stringify(data.data.user),
        //   });
        // }
        console.log("redirecting to dashboard!");
      }
      // onSubmit(user);
    } catch (error) {
      console.log(error);
    }
  };

  // useEffect to fetch current user data when component mounts
  const logoutUser = () => {
    setCurrentUser(null);
  };

  return (
    <UserContext.Provider value={{ currentUser, loginUser, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
