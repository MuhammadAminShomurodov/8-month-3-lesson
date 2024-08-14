import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface PrivateRouteProps {
  element: React.ReactNode; // Change from React.ReactElement to React.ReactNode
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
  const location = useLocation();
  const isAuthenticated = localStorage.getItem('auth') === 'true';

  return isAuthenticated ? (
    <>{element}</> // Wrap element in a fragment if using React.ReactNode
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default PrivateRoute;
