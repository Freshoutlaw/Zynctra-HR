/**
 * /frontend/src/pages/SecureTerminal.tsx
 *
 * Page wrapper around the SecureTerminalEmulator component.
 * Only accessible to SUPER_ADMIN and TENANT_ADMIN.
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import SecureTerminalEmulator from '../components/terminal/SecureTerminalEmulator';

const SecureTerminalPage: React.FC = () => {
  const navigate = useNavigate();
  const { effectiveTheme } = useTheme();
  const isDark = effectiveTheme === 'dark';

  return (
    <div
      className={`min-h-screen ${
        isDark ? 'bg-slate-950' : 'bg-slate-100'
      }`}
    >
      <SecureTerminalEmulator
        onClose={() => navigate(-1)}
      />
    </div>
  );
};

export default SecureTerminalPage;