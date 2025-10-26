import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import en from './locales/en.json';
import ru from './locales/ru.json';

type Locale = 'en' | 'ru';

const resources: Record<Locale, Record<string, any>> = {
  en,
  ru,
};

interface I18nContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (path: string, vars?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

export const I18nProvider: React.FC<{ children: ReactNode; defaultLocale?: Locale }> = ({ children, defaultLocale = 'en' }) => {
  const [locale, setLocale] = useState<Locale>(defaultLocale);

  const t = (path: string, vars?: Record<string, string | number>) => {
    const parts = path.split('.');
    let cur: any = resources[locale];
    for (const p of parts) {
      if (!cur) break;
      cur = cur[p];
    }
    if (cur == null) return path;

    let str = String(cur);
    if (vars) {
      for (const [k, v] of Object.entries(vars)) {
        str = str.replace(new RegExp(`{{\\s*${k}\\s*}}`, 'g'), String(v));
      }
    }
    return str;
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
};
