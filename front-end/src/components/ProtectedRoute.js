import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useAppContext } from "../AppContext";

const ProtectedRoute = ({ component: Component, roles, ...rest }) => {
  const { user, isLoading } = useAppContext();

  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <Route
      {...rest}
      render={(props) => {
        if (!user) {
          return <Redirect to="/login" />;
        }
        if (roles && !roles.includes(user.role)) {
          console.log(
            `User role ${user.role} not authorized, redirecting to homepage`
          );
          return <Redirect to="/homepage" />;
        }
        console.log(`User role ${user.role} authorized, rendering component`);
        return <Component {...props} />;
      }}
    />
  );
};

export default ProtectedRoute;
