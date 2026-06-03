/**
 * /frontend/src/main.tsx
 * 
 * Application entry point
 * Initializes all providers and mounts React app
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { ThemeProvider } from './context/ThemeContext';
import { initSupabase } from './services/supabase/supabaseClient';
import { getFeatureFlagService } from './services/billing/featureFlags';

// Initialize Supabase
try {
  initSupabase();
  console.log('[Supabase] Connected successfully');
} catch (error) {
  console.warn('[Supabase] Connection skipped - not configured for development');
}

// Initialize feature flags
const flags = getFeatureFlagService();
flags.initialize().catch((error) => {
  console.warn('[FeatureFlags] Failed to initialize:', error);
});

// Mount app
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);