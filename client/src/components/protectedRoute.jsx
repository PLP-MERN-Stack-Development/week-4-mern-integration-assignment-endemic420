import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const ProtectedRoute = ({ children }) => {
  const { user, isInitialized } = useAuth();
  console.log('ProtectedRoute: user state:', user, 'isInitialized:', isInitialized);
  if (!isInitialized) {
    return <div>Loading...</div>;
  }
  if (user === null) {
    console.log('ProtectedRoute: redirecting to /login');
    return <Navigate to="/login" state={{ from: window.location.pathname }} replace />;
  }
  return children;
};

export default ProtectedRoute;