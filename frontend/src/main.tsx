/**
 * /frontend/src/main.tsx
 *
 * Application entry point — initialises all providers and mounts React app.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { getFeatureFlagService } from './services/billing/featureFlags';

// Initialise feature flags (non-blocking)
const flags = getFeatureFlagService();
void flags.initialize().catch(() => {
  console.warn('[FeatureFlags] Failed to initialize — using defaults.');
});

const rootEl = document.getElementById('root');
if (!rootEl) throw new Error('Root element not found');

ReactDOM.createRoot(rootEl).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);