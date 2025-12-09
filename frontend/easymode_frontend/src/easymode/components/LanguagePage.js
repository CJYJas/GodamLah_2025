// /frontend-react/src/components/LanguagePage.js (i18n Enabled)

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next'; // 1. Import useTranslation
import HeaderBar from './HeaderBar';

// 2. Language list structure is fine, but we'll use the i18n instance's functions.
const languages = [
    { code: 'en', name: 'English', emoji: '🇬🇧' },
    { code: 'ms', name: 'Bahasa Melayu', emoji: '🇲🇾' },
    { code: 'zh', name: '中文 (Chinese)', emoji: '🇨🇳' },
    { code: 'ta', name: 'தமிழ் (Tamil)', emoji: '🇮🇳' },
];

function LanguagePage({ isEasyMode, goToPage, onMenuClick }) {
    // 3. Destructure the i18n instance and the t function
    const { t, i18n } = useTranslation(); 

    // The current language is derived directly from the i18n instance, 
    // replacing the mock `selectedLang` state.
    const currentLang = i18n.resolvedLanguage; 

    const handleSelectLanguage = (code) => {
        // 4. Use i18n.changeLanguage() to trigger the global language switch
        i18n.changeLanguage(code); 
        console.log(`Language set to: ${code}`);
        // No need to manually force a re-render; i18next handles it.
    };

    return (
        <div style={{ padding: '0 20px 20px 20px', textAlign: 'center' }}>
            <HeaderBar
                // 5. Translate the header title using a translation key
                title={t('sidemenu.language')}
                onBackClick={() => goToPage('dashboard')}
                onMenuClick={onMenuClick}
                isEasyMode={isEasyMode}
            />

            <h2 style={{ fontSize: isEasyMode ? '40px' : '30px', margin: '20px 0 30px 0', color: '#333' }}>
                {/* 6. Translate the main prompt */}
                {t('language_page.select_prompt')}
            </h2>

            {languages.map(lang => (
                <div
                    key={lang.code}
                    // 7. Use the real handler
                    onClick={() => handleSelectLanguage(lang.code)}
                    style={{
                        padding: '20px',
                        margin: '15px 0',
                        // 8. Compare against the real current language
                        border: `4px solid ${currentLang === lang.code ? 'green' : '#ddd'}`,
                        backgroundColor: currentLang === lang.code ? '#E6FBE6' : '#fff',
                        borderRadius: '15px',
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.2s',
                    }}
                >
                    <span role="img" aria-label={lang.name} style={{ fontSize: isEasyMode ? '60px' : '40px', display: 'block' }}>
                        {lang.emoji}
                    </span>
                    <p style={{ 
                        fontSize: isEasyMode ? '34px' : '22px', 
                        fontWeight: 'bold', 
                        color: currentLang === lang.code ? 'green' : '#333',
                        margin: '5px 0 0 0'
                    }}>
                        {/* The language name is static and doesn't need translation itself */}
                        {lang.name}
                    </p>
                </div>
            ))}
        </div>
    );
}

export default LanguagePage;