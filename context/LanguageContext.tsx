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
  
  // THE HYDRATION BUG FIX: Track if the component has mounted on the client
  const [mounted, setMounted] = useState(false); 

  useEffect(() => {
    // 1. Check local storage ONLY after the browser has loaded
    const savedLang = localStorage.getItem('khetify_lang') as Language;
    if (savedLang === 'en' || savedLang === 'hi') {
      setLocale(savedLang);
    }
    // 2. Tell the app it is safe to render
    setMounted(true); 
  }, []);

  const changeLanguage = (lang: Language) => {
    setLocale(lang);
    localStorage.setItem('khetify_lang', lang);
  };

  const t = (key: keyof typeof translations.en) => {
    return translations[locale]?.[key] || translations['en'][key] || key;
  };

  // THE HYDRATION BUG FIX: Do not render the UI until language is checked
  if (!mounted) {
    return null; // Prevents the ugly UI flashing and React crashes
  }

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