import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, requireMaster = false, requireWedding = false }) => {
  const { isMasterAdmin, currentWedding } = useAuth();

  if (requireMaster && !isMasterAdmin) {
    return <Navigate to="/login" replace />;
  }

  if (requireWedding && !currentWedding) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute; 