import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useWallet } from '../../hooks/useWallet';
import { REDIRECT_PATH_KEY } from '../../constants';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Route wrapper that redirects to welcome page if user is not authenticated
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { walletInfo } = useWallet();
  const location = useLocation();

  if (!walletInfo) {
    // Save the current path for redirect after login
    const redirectPath = location.pathname + location.search;
    console.log('Saving redirect path:', redirectPath);
    sessionStorage.setItem(REDIRECT_PATH_KEY, redirectPath);

    return <Navigate to="/welcome" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
