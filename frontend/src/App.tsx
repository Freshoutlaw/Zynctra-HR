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
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import PricingPage from './pages/PricingPage';
import SubscriptionDashboard from './pages/SubscriptionDashboard';
import PaymentVerification from './pages/PaymentVerification';
import AdminPanel from './pages/AdminPanel';
import DashboardPage from './pages/DashboardPage';
import NotFoundPage from './pages/NotFoundPage';
import { UserRole } from './types/auth.types';

// ---------------------------------------------------------------------------
// Route guard
// ---------------------------------------------------------------------------

interface ProtectedRouteProps {
  element: React.ReactNode;
  requiredRole?: UserRole;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  element,
  requiredRole,
}) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) return <LoadingPage />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (requiredRole && user?.role !== requiredRole)
    return <Navigate to="/dashboard" replace />;

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
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* Pricing — only shown when monetisation is on */}
        {!flags.isFreeModeActive() && (
          <Route path="/pricing" element={<PricingPage />} />
        )}

        {/* Protected */}
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