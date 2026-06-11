/**
 * /frontend/src/App.tsx
 *
 * Root application component — handles routing and route guards.
 * AuthProvider is mounted in main.tsx; useAuth() is safe here.
 */

import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { getFeatureFlagService } from './services/billing/featureFlags';

// Pages
import LoadingPage from './pages/LoadingPage';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MFASetupPage from './pages/MFASetupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import PricingPage from './pages/PricingPage';
import SubscriptionDashboard from './pages/SubscriptionDashboard';
import PaymentVerification from './pages/PaymentVerification';
import AdminPanel from './pages/AdminPanel';
import DashboardPage from './pages/DashboardPage';
import NotFoundPage from './pages/NotFoundPage';
import { UserRole } from './types/auth.types';

// ---------------------------------------------------------------------------
// Route guards
// ---------------------------------------------------------------------------

interface ProtectedRouteProps {
  element: React.ReactNode;
  requiredRole?: UserRole;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  element,
  requiredRole,
}) => {
  const { isAuthenticated, mfaVerified, user, isLoading } = useAuth();

  if (isLoading) return <LoadingPage />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!mfaVerified) return <Navigate to="/mfa-setup" replace />;
  if (requiredRole && user?.role !== requiredRole)
    return <Navigate to="/dashboard" replace />;

  return <>{element}</>;
};

// MFA Setup — must be authenticated but MFA not yet complete
const MFASetupRoute: React.FC = () => {
  const { isAuthenticated, mfaVerified, isLoading } = useAuth();

  if (isLoading) return <LoadingPage />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (mfaVerified) return <Navigate to="/dashboard" replace />;

  return <MFASetupPage />;
};

// Auth redirect — if already fully authenticated, go to dashboard
const AuthRoute: React.FC<{ element: React.ReactNode }> = ({ element }) => {
  const { isAuthenticated, mfaVerified, isLoading } = useAuth();

  if (isLoading) return <LoadingPage />;
  if (isAuthenticated && mfaVerified) return <Navigate to="/dashboard" replace />;
  if (isAuthenticated && !mfaVerified) return <Navigate to="/mfa-setup" replace />;

  return <>{element}</>;
};

// ---------------------------------------------------------------------------
// App
// ---------------------------------------------------------------------------

const App: React.FC = () => {
  const { isLoading } = useAuth();
  const flags = getFeatureFlagService();

  useEffect(() => {
    void flags.initialize();
  }, []);

  if (isLoading) return <LoadingPage />;

  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />

        {/* Auth pages — redirect to dashboard if already logged in + MFA */}
        <Route path="/login" element={<AuthRoute element={<LoginPage />} />} />
        <Route path="/register" element={<AuthRoute element={<RegisterPage />} />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* MFA Setup — authenticated but MFA not yet complete */}
        <Route path="/mfa-setup" element={<MFASetupRoute />} />

        {/* Pricing — only shown when monetisation is on */}
        {!flags.isFreeModeActive() && (
          <Route path="/pricing" element={<PricingPage />} />
        )}

        {/* Protected — require auth + MFA */}
        <Route
          path="/dashboard"
          element={<ProtectedRoute element={<DashboardPage />} />}
        />
        <Route
          path="/dashboard/subscription"
          element={<ProtectedRoute element={<SubscriptionDashboard />} />}
        />
        <Route
          path="/payment-verification"
          element={<ProtectedRoute element={<PaymentVerification />} />}
        />

        {/* Admin */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute
              element={<AdminPanel />}
              requiredRole={UserRole.SUPER_ADMIN}
            />
          }
        />

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

export default App;