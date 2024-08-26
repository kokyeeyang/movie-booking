import { createContext, useContext, useEffect, useState } from "react";
export const AlertContext = createContext();

export const useAlert = () => useContext(AlertContext);

const AlertProvider = ({ children }) => {
  const [alert, setAlert] = useState();

  const showAlert = (message, type) => {
    setAlert({ message, type });
  };

  useEffect(() => {
    let timer;
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
