/**
 * /frontend/src/App.tsx
 * 
 * Root application component
 * Handles routing, authentication, and middleware
 */

import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { useTheme } from './context/ThemeContext';
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

/**
 * Protected Route Wrapper
 */
interface ProtectedRouteProps {
  element: React.ReactNode;
  requiredRole?: string;
  requireSubscription?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  element,
  requiredRole,
  requireSubscription,
}) => {
  const { isAuthenticated, user } = useAuth();

  // Not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check role
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }

  // Check subscription
  if (requireSubscription) {
    const flags = getFeatureFlagService();
    if (!flags.isFreeModeActive()) {
      // Would check actual subscription here
    }
  }

  return <>{element}</>;
};

/**
 * App Component
 */
const App: React.FC = () => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { effectiveTheme } = useTheme();
  const flags = getFeatureFlagService();

  // Initialize feature flags on mount
  useEffect(() => {
    flags.initialize();
  }, []);

  // Loading
  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* Pricing - Only visible when paid mode is enabled */}
        {!flags.isFreeModeActive() && (
          <Route path="/pricing" element={<PricingPage />} />
        )}

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute
              element={<DashboardPage />}
              requireSubscription={true}
            />
          }
        />

        <Route
          path="/dashboard/subscription"
          element={
            <ProtectedRoute element={<SubscriptionDashboard />} />
          }
        />

        <Route
          path="/payment-verification"
          element={
            <ProtectedRoute element={<PaymentVerification />} />
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute
              element={<AdminPanel />}
              requiredRole="SUPER_ADMIN"
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