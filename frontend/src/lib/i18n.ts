import React from 'react';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import enTranslations from '../../locales/en.json';
import zhTranslations from '../../locales/zh.json';

type Locale = 'en' | 'zh';

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

// Type assertion for nested translation structures
const translations: Record<Locale, Record<string, unknown>> = {
  en: enTranslations as unknown as Record<string, unknown>,
  zh: zhTranslations as unknown as Record<string, unknown>,
};

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>('en');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // 语言包已静态导入，直接标记为已加载
    setLoaded(true);
  }, []);

  const t = (key: string): string => {
    if (!loaded) return key;
    const keys = key.split('.');
    let value: unknown = translations[locale];
    for (const k of keys) {
      if (value === undefined) return key;
      value = (value as Record<string, unknown>)[k];
    }
    return (value as string) || key;
  };

  // 从 localStorage 加载保存的语言设置
  useEffect(() => {
    const saved = localStorage.getItem('locale') as Locale;
    if (saved && (saved === 'en' || saved === 'zh')) {
      setLocale(saved);
    }
  }, []);

  const handleSetLocale = (newLocale: Locale) => {
    setLocale(newLocale);
    localStorage.setItem('locale', newLocale);
  };

  return React.createElement(
    I18nContext.Provider,
    { value: { locale, setLocale: handleSetLocale, t } },
    children
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
}
