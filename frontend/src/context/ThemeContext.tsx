/**
 * /frontend/src/context/ThemeContext.tsx
 * 
 * Theme provider for light/dark mode support
 * Persists user preference to localStorage and Supabase
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { userProfileService } from '../services/supabase/supabaseClient';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  effectiveTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * Theme Provider Component
 */
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [theme, setThemeState] = useState<Theme>('system');
  const [effectiveTheme, setEffectiveTheme] = useState<'light' | 'dark'>('dark');
  const [mounted, setMounted] = useState(false);

  /**
   * Load theme preference on mount
   */
  useEffect(() => {
    loadTheme();
    setMounted(true);

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => updateEffectiveTheme();
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  /**
   * Update effective theme when theme or system preference changes
   */
  useEffect(() => {
    updateEffectiveTheme();
  }, [theme]);

  /**
   * Load theme preference
   */
  const loadTheme = async () => {
    try {
      // First, try to load from localStorage
      const stored = localStorage.getItem('theme') as Theme | null;
      if (stored) {
        setThemeState(stored);
        return;
      }

      // If user is authenticated, load from Supabase
      if (user?.id) {
        const profile = await userProfileService.getProfile(user.id);
        if (profile) {
          setThemeState(profile.theme_preference);
          return;
        }
      }

      // Default to system
      setThemeState('system');
    } catch (error) {
      console.error('Failed to load theme:', error);
      setThemeState('system');
    }
  };

  /**
   * Determine effective theme (light or dark)
   */
  const updateEffectiveTheme = () => {
    let effective: 'light' | 'dark';

    if (theme === 'system') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      effective = isDark ? 'dark' : 'light';
    } else {
      effective = theme;
    }

    setEffectiveTheme(effective);

    // Apply to document
    if (effective === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  /**
   * Set theme
   */
  const setTheme = async (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);

    // Save to Supabase if authenticated
    if (user?.id) {
      try {
        await userProfileService.updateTheme(user.id, newTheme);
      } catch (error) {
        console.error('Failed to save theme preference:', error);
      }
    }
  };

  // Don't render until mounted to avoid hydration issues
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={{ theme, effectiveTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * useTheme hook
 */
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export default ThemeProvider;