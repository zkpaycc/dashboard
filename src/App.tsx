import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import WelcomePage from './pages/WelcomePage';
import IndexPage from './pages/IndexPage';
import PaymentDetailsPage from './pages/PaymentDetailsPage';
import PaymentCreatePage from './pages/PaymentCreatePage';
import ProtectedRoute from './components/routing/ProtectedRoute';
import { WalletProvider } from './context/wallet/WalletProvider';
import PublicRoute from './components/routing/PublicRoute';
import AuthRedirectHandler from './components/routing/AuthRedirectHandler';

function App() {
  return (
    <BrowserRouter>
      <WalletProvider>
        {/* This component will handle redirects after authentication */}
        <AuthRedirectHandler />
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <IndexPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/channels/:id"
            element={
              <ProtectedRoute>
                <PaymentDetailsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-channel"
            element={
              <ProtectedRoute>
                <PaymentCreatePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/welcome"
            element={
              <PublicRoute>
                <WelcomePage />
              </PublicRoute>
            }
          />
          <Route path="*" element={<Navigate to="/welcome" replace />} />
        </Routes>
      </WalletProvider>
    </BrowserRouter>
  );
}

export default App;
