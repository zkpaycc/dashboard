import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../../hooks/useWallet';
import { REDIRECT_PATH_KEY } from '../../constants';

/**
 * Component that handles redirects after authentication
 */
const AuthRedirectHandler = () => {
  const { walletInfo } = useWallet();
  const navigate = useNavigate();

  useEffect(() => {
    // This effect runs once when the component mounts
    // and whenever walletInfo changes
    if (walletInfo) {
      const savedPath = sessionStorage.getItem(REDIRECT_PATH_KEY);

      if (savedPath) {
        console.log('AuthRedirectHandler: Redirecting to', savedPath);
        sessionStorage.removeItem(REDIRECT_PATH_KEY);

        // Use setTimeout to ensure this happens after other state updates
        setTimeout(() => {
          navigate(savedPath, { replace: true });
        }, 0);
      }
    }
  }, [walletInfo, navigate]);

  return null;
};

export default AuthRedirectHandler;
