import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('votesmart_language') || null;
  });

  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('votesmart_language', lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}

/** Helper: pick field based on language. Usage: lt(step, 'title', language) returns step.titleHi or step.title */
export function lt(obj, field, language) {
  if (language === 'hi' && obj[field + 'Hi']) return obj[field + 'Hi'];
  return obj[field];
}

export default LanguageContext;
