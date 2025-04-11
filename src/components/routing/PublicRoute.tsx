import React from 'react';
import { Navigate } from 'react-router-dom';
import { useWallet } from '../../hooks/useWallet';

interface PublicRouteProps {
  children: React.ReactNode;
}

/**
 * Route wrapper that redirects to home page if user is already authenticated
 */
const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { walletInfo } = useWallet();

  if (walletInfo) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;
