// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector'; // Added for convenience

// 1. Ensure you are importing ALL language files:
import enTranslation from './easymode/locales/en/common.json'; 
import msTranslation from './easymode/locales/ms/common.json'; 
import zhTranslation from './easymode/locales/zh/common.json'; 
import taTranslation from './easymode/locales/ta/common.json';

const resources = {
    // 2. ENSURE ALL IMPORTED FILES ARE ADDED TO THE RESOURCES OBJECT:
    en: {
        translation: enTranslation, // English resources
    },
    ms: {
        translation: msTranslation, // Malay resources
    },
    zh: {
        translation: zhTranslation, // Chinese resources
    },
    ta: {
        translation: taTranslation, // Tamil resources
    },
};

i18n
    // Optional, but recommended to detect and store user's language preference
    .use(LanguageDetector) 
    .use(initReactI18next)
    .init({
        resources, // Pass the complete map of resources
        lng: 'en', // Starting language
        fallbackLng: 'en', 
        debug: true, // Helpful for debugging language issues
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;