/**
 * /frontend/src/components/layout/AppLayout.tsx
 *
 * Standard authenticated app layout with Navbar, Sidebar, and content area.
 */

import React, { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { useTheme } from '../../context/ThemeContext';
import ToastContainer from '../common/ToastContainer';

interface AppLayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
  showFooter?: boolean;
}

const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  showSidebar = true,
  showFooter = false,
}) => {
  const { effectiveTheme } = useTheme();
  const isDark = effectiveTheme === 'dark';
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div
      className={`min-h-screen flex flex-col ${
        isDark
          ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white'
          : 'bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-900'
      }`}
    >
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        {showSidebar && (
          <Sidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
        )}

        <main className="flex-1 overflow-y-auto">
          {/* Mobile sidebar toggle */}
          {showSidebar && (
            <button
              onClick={() => setSidebarOpen(true)}
              className={`md:hidden m-4 p-2 rounded-lg ${
                isDark
                  ? 'bg-slate-800 text-slate-300'
                  : 'bg-slate-200 text-slate-700'
              }`}
              aria-label="Open menu"
            >
              ≡
            </button>
          )}

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </div>
        </main>
      </div>

      {showFooter && <Footer />}

      {/* Global toast container */}
      <ToastContainer />
    </div>
  );
};

export default AppLayout;