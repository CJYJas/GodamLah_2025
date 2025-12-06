// /frontend-react/src/components/LanguagePage.js

import React, { useState } from 'react';
import HeaderBar from './HeaderBar';

const languages = [
    { code: 'en', name: 'English', emoji: '🇬🇧' },
    { code: 'ms', name: 'Bahasa Melayu', emoji: '🇲🇾' },
    { code: 'zh', name: '中文 (Chinese)', emoji: '🇨🇳' },
    { code: 'ta', name: 'தமிழ் (Tamil)', emoji: '🇮🇳' },
];

function LanguagePage({ isEasyMode, goToPage, onMenuClick }) {
    // Mock the global language state being stored here
    const [selectedLang, setSelectedLang] = useState('en'); 

    const handleSelectLanguage = (code) => {
        setSelectedLang(code);
        console.log(`Language set to: ${code}`);
        // In a real app: Update the global language state and force a re-render/reload.
    };

    return (
        <div style={{ padding: '0 20px 20px 20px', textAlign: 'center' }}>
            <HeaderBar
                title="Language"
                onBackClick={() => goToPage('dashboard')}
                onMenuClick={onMenuClick}
                isEasyMode={isEasyMode}
            />

            <h2 style={{ fontSize: isEasyMode ? '40px' : '30px', margin: '20px 0 30px 0', color: '#333' }}>
                Select Your Language
            </h2>

            {languages.map(lang => (
                <div
                    key={lang.code}
                    onClick={() => handleSelectLanguage(lang.code)}
                    style={{
                        padding: '20px',
                        margin: '15px 0',
                        border: `4px solid ${selectedLang === lang.code ? 'green' : '#ddd'}`,
                        backgroundColor: selectedLang === lang.code ? '#E6FBE6' : '#fff',
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
                        color: selectedLang === lang.code ? 'green' : '#333',
                        margin: '5px 0 0 0'
                    }}>
                        {lang.name}
                    </p>
                </div>
            ))}
        </div>
    );
}

export default LanguagePage;