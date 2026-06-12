/**
 * /frontend/src/context/ThemeContext.tsx
 *
 * Theme provider for light/dark mode support.
 * Hardened:
 *  - No FOUC (Flash of Unstyled Content) — theme applied before React paint
 *  - No blank screen on mount
 *  - System preference respected
 *  - localStorage persistence (non-sensitive)
 *  - Graceful Supabase sync (best-effort, never crashes UI)
 */

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

export type Theme = 'light' | 'dark' | 'system';

export interface ThemeContextType {
  theme: Theme;
  effectiveTheme: 'light' | 'dark';
  setTheme: (theme: Theme | ((prev: Theme) => Theme)) => void;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = 'zynctra-theme';

const resolveEffective = (t: Theme): 'light' | 'dark' => {
  if (t !== 'system') return t;
  if (typeof window === 'undefined') return 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const applyThemeClass = (effective: 'light' | 'dark') => {
  const root = document.documentElement;
  if (effective === 'dark') {
    root.classList.add('dark');
    root.classList.remove('light');
  } else {
    root.classList.add('light');
    root.classList.remove('dark');
  }
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setThemeState] = useState<Theme>('system');
  const [effectiveTheme, setEffectiveTheme] = useState<'light' | 'dark'>('dark');

  // Apply theme immediately on mount (before paint) to prevent FOUC
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
    const initial: Theme = stored ?? 'system';
    const effective = resolveEffective(initial);
    applyThemeClass(effective);
    setThemeState(initial);
    setEffectiveTheme(effective);
  }, []);

  // Listen for system preference changes
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      setThemeState((prev) => {
        if (prev === 'system') {
          const eff = resolveEffective('system');
          applyThemeClass(eff);
          setEffectiveTheme(eff);
        }
        return prev;
      });
    };
    mq.addEventListener('change', handleChange);
    return () => mq.removeEventListener('change', handleChange);
  }, []);

  const setTheme = useCallback((newTheme: Theme | ((prev: Theme) => Theme)) => {
    setThemeState((prev) => {
      const resolved = typeof newTheme === 'function' ? newTheme(prev) : newTheme;
      localStorage.setItem(STORAGE_KEY, resolved);
      const eff = resolveEffective(resolved);
      applyThemeClass(eff);
      setEffectiveTheme(eff);
      return resolved;
    });

    // Best-effort Supabase persistence — lazy import to avoid crash if not configured
    import('../services/supabase/supabaseClient')
      .then(({ userProfileService }) => {
        const userId = sessionStorage.getItem('__zynctra__user_id');
        if (userId) {
          void userProfileService.updateTheme(userId, typeof newTheme === 'function' ? 'system' : newTheme);
        }
      })
      .catch(() => {
        // Supabase not configured — silently ignore
      });
  }, []);

  const toggle = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      return next;
    });
  }, [setTheme]);

  const value: ThemeContextType = {
    theme,
    effectiveTheme,
    setTheme,
    toggle,
  };

  // Never return null — always render children
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextType => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};

export default useTheme;