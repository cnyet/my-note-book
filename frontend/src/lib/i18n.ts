import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Locale = 'en' | 'zh';

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

let translations: Record<Locale, Record<string, string>> = {};

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>('en');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // 加载语言包
    Promise.all([
      import(`/locales/${locale}.json`),
    ]).then(([module]) => {
      translations = { [locale]: module.default };
      setLoaded(true);
    });
  }, [locale]);

  const t = (key: string): string => {
    if (!loaded) return key;
    const keys = key.split('.');
    let value: any = translations[locale];
    for (const k of keys) {
      value = value?.[k];
    }
    return value || key;
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
}
