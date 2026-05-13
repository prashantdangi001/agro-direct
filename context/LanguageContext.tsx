'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations, Language } from '@/utils/translations';

interface LanguageContextType {
  locale: Language;
  setLocale: (lang: Language) => void;
  t: (key: keyof typeof translations.en) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Language>('en');
  const [mounted, setMounted] = useState(false); 

  useEffect(() => {
    const savedLang = localStorage.getItem('khetify_lang') as Language;
    if (savedLang && ['en', 'hi', 'pa', 'mr'].includes(savedLang)) {
      setLocale(savedLang);
    }
    setMounted(true); 
  }, []);

  const changeLanguage = (lang: Language) => {
    setLocale(lang);
    localStorage.setItem('khetify_lang', lang);
  };

  const t = (key: keyof typeof translations.en) => {
    return translations[locale]?.[key] || translations['en'][key] || key;
  };

  if (!mounted) return null;

  return (
    <LanguageContext.Provider value={{ locale, setLocale: changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
};