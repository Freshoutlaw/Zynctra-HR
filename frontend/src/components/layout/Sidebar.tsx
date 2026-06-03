// Placeholder: Sidebar.tsx
import React from 'react';

const Sidebar: React.FC = () => {
  return <div>Placeholder Component</div>;
};

export default Sidebar;
/**
 * /frontend/src/components/layout/Sidebar.tsx
 * 
 * Collapsible sidebar with navigation menu
 */

import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import useAuth from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';

interface MenuItemProps {
  label: string;
  icon: string;
  path: string;
  badge?: number;
  isActive: boolean;
}

/**
 * MenuItem Component
 */
const MenuItem: React.FC<MenuItemProps & { isDark: boolean; onClick: () => void }> = ({
  label,
  icon,
  path,
  badge,
  isActive,
  isDark,
  onClick,
}) => (
  <motion.a
    href={path}
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition relative group ${
      isActive
        ? 'bg-gradient-to-r from-cyan-500/30 to-cyan-600/20 text-cyan-300 border border-cyan-500/50'
        : isDark
          ? 'text-slate-400 hover:text-slate-300 hover:bg-slate-800/50'
          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
    }`}
    whileHover={{ x: 4 }}
    whileTap={{ scale: 0.98 }}
  >
    <span className="text-lg">{icon}</span>
    <span className="text-sm font-medium">{label}</span>
    {badge && badge > 0 && (
      <motion.span
        className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
      >
        {badge}
      </motion.span>
    )}
  </motion.a>
);

/**
 * Sidebar Component
 */
const Sidebar: React.FC<{ isOpen?: boolean; onClose?: () => void }> = ({
  isOpen = true,
  onClose,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { effectiveTheme } = useTheme();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const isDark = effectiveTheme === 'dark';

  const baseMenuItems = [
    {
      label: 'Dashboard',
      icon: '📊',
      path: '/dashboard',
    },
    {
      label: 'Subscription',
      icon: '💳',
      path: '/dashboard/subscription',
    },
    {
      label: 'Employees',
      icon: '👥',
      path: '/dashboard/employees',
    },
    {
      label: 'Payroll',
      icon: '💰',
      path: '/dashboard/payroll',
    },
    {
      label: 'Performance',
      icon: '📈',
      path: '/dashboard/performance',
    },
    {
      label: 'Documents',
      icon: '📁',
      path: '/dashboard/documents',
    },
  ];

  const adminMenuItems = [
    {
      label: 'Organizations',
      icon: '🏢',
      path: '/admin/organizations',
    },
    {
      label: 'Subscriptions',
      icon: '🔑',
      path: '/admin/subscriptions',
    },
    {
      label: 'Audit Logs',
      icon: '📋',
      path: '/admin/audit-logs',
    },
    {
      label: 'Settings',
      icon: '⚙️',
      path: '/admin/settings',
    },
  ];

  const isAdmin = user?.role === 'SUPER_ADMIN';
  const menuItems = isAdmin ? [...baseMenuItems, ...adminMenuItems] : baseMenuItems;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 md:hidden z-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        className={`fixed md:sticky top-16 left-0 h-[calc(100vh-4rem)] z-40 transition-all border-r ${
          isDark
            ? 'bg-slate-900/95 border-slate-800'
            : 'bg-white/95 border-slate-200'
        } ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } ${isCollapsed ? 'w-20' : 'w-64'}`}
        initial={{ x: isOpen ? 0 : -256 }}
        animate={{ x: isOpen ? 0 : -256 }}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between p-4 border-b ${
            isDark ? 'border-slate-800' : 'border-slate-200'
          }`}
        >
          {!isCollapsed && (
            <h2 className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-cyan-600 bg-clip-text text-transparent">
              Menu
            </h2>
          )}
          <motion.button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`p-2 rounded-lg transition ${
              isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'
            }`}
            whileTap={{ scale: 0.95 }}
            title={isCollapsed ? 'Expand' : 'Collapse'}
          >
            {isCollapsed ? '▶' : '◀'}
          </motion.button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <MenuItem
                key={item.path}
                {...item}
                isActive={isActive}
                isDark={isDark}
                onClick={() => {
                  navigate(item.path);
                  onClose?.();
                }}
              />
            );
          })}
        </nav>

        {/* Footer */}
        <div
          className={`p-4 border-t ${isDark ? 'border-slate-800' : 'border-slate-200'}`}
        >
          <motion.button
            onClick={() => navigate('/dashboard/settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              isDark
                ? 'text-slate-400 hover:text-slate-300 hover:bg-slate-800/50'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="text-lg">⚙️</span>
            {!isCollapsed && <span className="text-sm font-medium">Settings</span>}
          </motion.button>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;