import React, { createContext, useContext, useState, useEffect } from 'react';
import { flushSync } from 'react-dom';

interface ThemeContextType {
  darkMode: boolean;
  toggleTheme: () => void;
}

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const supportsViewTransitions = () =>
  typeof document !== 'undefined' && 'startViewTransition' in document;

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useThemeMode = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeMode must be used within a ThemeContextProvider');
  }
  return context;
};

interface ThemeContextProviderProps {
  children: React.ReactNode;
}

export const ThemeContextProvider: React.FC<ThemeContextProviderProps> = ({ children }) => {
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('themeMode');
      if (saved) {
        setDarkMode(saved === 'dark');
      } else {
        setDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('themeMode', darkMode ? 'dark' : 'light');
      document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    }
  }, [darkMode]);

  const toggleTheme = () => {
    const next = !darkMode;
    if (supportsViewTransitions() && !prefersReducedMotion()) {
      document.startViewTransition!(() => {
        flushSync(() => setDarkMode(next));
      });
    } else {
      setDarkMode(next);
    }
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
