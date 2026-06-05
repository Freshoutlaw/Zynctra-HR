/**
 * /frontend/src/context/ThemeContext.tsx
 *
 * Theme provider for light/dark mode support.
 * Persists user preference to localStorage.
 * Supabase persistence is attempted gracefully and never crashes the UI.
 */

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  effectiveTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setThemeState] = useState<Theme>('system');
  const [effectiveTheme, setEffectiveTheme] = useState<'light' | 'dark'>('dark');
  const [mounted, setMounted] = useState(false);

  // Derive effective theme (light | dark) from theme + system preference
  const resolveEffective = (t: Theme): 'light' | 'dark' => {
    if (t !== 'system') return t;
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  };

  const applyTheme = (effective: 'light' | 'dark') => {
    if (effective === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    setEffectiveTheme(effective);
  };

  useEffect(() => {
    const stored = localStorage.getItem('theme') as Theme | null;
    const initial: Theme = stored ?? 'system';
    setThemeState(initial);
    applyTheme(resolveEffective(initial));
    setMounted(true);

    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      setThemeState((prev) => {
        if (prev === 'system') applyTheme(resolveEffective('system'));
        return prev;
      });
    };
    mq.addEventListener('change', handleChange);
    return () => mq.removeEventListener('change', handleChange);
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(resolveEffective(newTheme));

    // Best-effort Supabase persistence — import lazily to avoid crash if not configured
    import('../services/supabase/supabaseClient')
      .then(({ userProfileService }) => {
        const userId = sessionStorage.getItem('__zynctra__user_id');
        if (userId) {
          void userProfileService.updateTheme(userId, newTheme);
        }
      })
      .catch(() => {
        // Supabase not configured — silently ignore
      });
  };

  if (!mounted) return null;

  return (
    <ThemeContext.Provider value={{ theme, effectiveTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};

export default ThemeProvider;