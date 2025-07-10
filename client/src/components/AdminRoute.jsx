import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const AdminRoute = ({ element }) => {
  const { user } = useAuth();
  return user && user.role === 'admin' ? element : <Navigate to="/dashboard" />;
};

export default AdminRoute;