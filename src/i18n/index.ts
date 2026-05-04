import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { flushSync } from 'react-dom';
import { en } from './translations/en';
import { ptBr } from './translations/pt-br';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const supportsViewTransitions = () =>
  typeof document !== 'undefined' && 'startViewTransition' in document;

export type Translations = typeof en;
export type Locale = 'en' | 'pt-br';

const translations: Record<Locale, Translations> = { en, 'pt-br': ptBr };

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Translations;
}

const I18nContext = createContext<I18nContextValue>({
  locale: 'en',
  setLocale: () => {},
  t: en,
});

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<Locale>('en');

  useEffect(() => {
    const stored = localStorage.getItem('locale');
    if (stored === 'en' || stored === 'pt-br') {
      setLocaleState(stored);
    } else if (navigator.language.toLowerCase().startsWith('pt')) {
      setLocaleState('pt-br');
    }
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('locale', newLocale);
    }
    if (supportsViewTransitions() && !prefersReducedMotion()) {
      document.startViewTransition!(() => {
        flushSync(() => setLocaleState(newLocale));
      });
    } else {
      setLocaleState(newLocale);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale === 'pt-br' ? 'pt-BR' : 'en';
  }, [locale]);

  const value: I18nContextValue = {
    locale,
    setLocale,
    t: translations[locale],
  };

  return React.createElement(I18nContext.Provider, { value }, children);
};

export const useI18n = () => useContext(I18nContext);
