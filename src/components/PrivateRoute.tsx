import React from "react";
import { Navigate, RouteProps } from "react-router-dom";

interface PrivateRouteProps extends RouteProps {
  element: React.ReactElement;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
  const isAuthenticated = localStorage.getItem("auth") === "true";

  return isAuthenticated ? element : <Navigate to="/login" />;
};

export default PrivateRoute;
