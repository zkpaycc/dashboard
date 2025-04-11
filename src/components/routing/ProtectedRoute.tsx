import React from 'react';
import { Navigate } from 'react-router-dom';
import { useWallet } from '../../hooks/useWallet';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Route wrapper that redirects to welcome page if user is not authenticated
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { walletInfo } = useWallet();

  if (!walletInfo) {
    return <Navigate to="/welcome" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
