import React, { createContext, useContext, useState, ReactNode } from 'react';
import { translations } from '../translations';

// 1. Define the shape of your Context
type Language = 'en' | 'bm';

interface LanguageContextType {
    language: Language;
    toggleLanguage: () => void;
    setLanguage: (lang: Language) => void; // Added this to fix your specific error
    t: typeof translations['en'];
}

// 2. Create the Context (Exported just in case, but prefer the hook)
export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// 3. Create the Provider
export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [language, setLanguageState] = useState<Language>('en');

    const toggleLanguage = () => {
        setLanguageState((prev) => (prev === 'en' ? 'bm' : 'en'));
    };

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
    };

    const t = translations[language];

    return (
        <LanguageContext.Provider value={{ language, toggleLanguage, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

// 4. Create the Custom Hook (Use this in your pages!)
export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
};