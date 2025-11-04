import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ isAllowed, redirectPath = '/login', children }) => {
  // If the user is not allowed, redirect them to the specified path.
  if (!isAllowed) {
    return <Navigate to={redirectPath} replace />;
  }

  // If the user is allowed, render the component they were trying to access.
  return children;
};

export default ProtectedRoute;