import React from "react";
import { Navigate, useLocation } from "react-router-dom";

interface PrivateRouteProps {
  element: React.ReactElement;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
  const location = useLocation();
  const isAuthenticated = localStorage.getItem("auth") === "true";

  return isAuthenticated ? (
    element
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default PrivateRoute;
