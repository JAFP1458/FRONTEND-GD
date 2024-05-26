import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ token, children }) => {
  if (!token) {
    // Si no hay token, redirigir a la página de login
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
