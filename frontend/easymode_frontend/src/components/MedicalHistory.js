// /frontend-react/src/components/MedicalHistory.js

import React from 'react';
import { useTranslation } from 'react-i18next';
import HeaderBar from './HeaderBar'; 

// --- LOCAL MOCK DATA ---
const mockHistoryData = {
    // ... data remains the same ...
};

const PHONE_MAX_WIDTH = '450px';

function MedicalHistory({ isEasyMode, goToPage, onMenuClick }) {
    const { t } = useTranslation();

    const headerFontSize = isEasyMode ? 40 : 28;
    const baseFontSize = isEasyMode ? 28 : 18;

    // ... styles remain the same ...
    const historyCardStyle = (color) => ({
        padding: '25px',
        borderRadius: '20px',
        margin: '25px auto',
        backgroundColor: color.bg,
        border: `4px solid ${color.border}`,
        textAlign: 'center',
        maxWidth: '400px',
        cursor: 'pointer',
        boxShadow: `0 8px 15px ${color.border}4D`,
        transition: 'all 0.3s',
    });

    const colors = {
        medication: { bg: '#E8F0FE', border: '#1A73E8', emoji: '💊' }, 
        hospitalized: { bg: '#FFFDE7', border: '#FFD700', emoji: '🏥' }, 
        vaccination: { bg: '#E6FBE6', border: '#4CAF50', emoji: '💉' }, 
    };

    /**
     * Handles card click: Navigates directly to the specific detail page.
     * @param {string} key - 'medication', 'hospitalized', or 'vaccination'
     */
    const handleHistoryClick = (key) => {
        // Construct the specific page route name
        const pageRoute = `history-${key}`; 
        goToPage(pageRoute); // Go to the corresponding detail page
    };

    return (
        <div 
            style={{
                padding: '0 20px 20px 20px',
                maxWidth: PHONE_MAX_WIDTH,
                margin: '0 auto',
            }}
        >
            <HeaderBar
                title={t('header.title_history')}
                onBackClick={() => goToPage('dashboard')}
                onMenuClick={onMenuClick}
                isEasyMode={isEasyMode}
            />

            <h2 style={{ fontSize: headerFontSize, margin: '60px 0 20px 0', textAlign: 'center', color: '#333' }}>
                {t('medical_history.title')}
            </h2>

            {/* --- 1. Medication History Card --- */}
            <div 
                onClick={() => handleHistoryClick('medication')}
                style={historyCardStyle(colors.medication)}
            >
                <span style={{ fontSize: isEasyMode ? '80px' : '50px', display: 'block' }}>
                    {colors.medication.emoji}
                </span>
                <p style={{ fontSize: baseFontSize, fontWeight: '900', margin: '10px 0 0 0', color: colors.medication.border }}>
                    {t('medical_history.medication_title')}
                </p>
                <p style={{ fontSize: isEasyMode ? '20px' : '14px', margin: '5px 0 0 0', color: '#666' }}>
                    {t('medical_history.medication_subtitle')}
                </p>
            </div>

            {/* --- 2. Hospitalized History Card --- */}
            <div 
                onClick={() => handleHistoryClick('hospitalized')}
                style={historyCardStyle(colors.hospitalized)}
            >
                <span style={{ fontSize: isEasyMode ? '80px' : '50px', display: 'block' }}>
                    {colors.hospitalized.emoji}
                </span>
                <p style={{ fontSize: baseFontSize, fontWeight: '900', margin: '10px 0 0 0', color: colors.hospitalized.border }}>
                    {t('medical_history.hospitalized_title')}
                </p>
                <p style={{ fontSize: isEasyMode ? '20px' : '14px', margin: '5px 0 0 0', color: '#666' }}>
                    {t('medical_history.hospitalized_subtitle')}
                </p>
            </div>

            {/* --- 3. Vaccination Record Card --- */}
            <div 
                onClick={() => handleHistoryClick('vaccination')}
                style={historyCardStyle(colors.vaccination)}
            >
                <span style={{ fontSize: isEasyMode ? '80px' : '50px', display: 'block' }}>
                    {colors.vaccination.emoji}
                </span>
                <p style={{ fontSize: baseFontSize, fontWeight: '900', margin: '10px 0 0 0', color: colors.vaccination.border }}>
                    {t('medical_history.vaccination_title')}
                </p>
                <p style={{ fontSize: isEasyMode ? '20px' : '14px', margin: '5px 0 0 0', color: '#666' }}>
                    {t('medical_history.vaccination_subtitle')}
                </p>
            </div>

            <p style={{ fontSize: isEasyMode ? '22px' : '14px', margin: '40px auto 10px auto', maxWidth: '400px', textAlign: 'center', color: '#999' }}>
                * {t('medical_history.disclaimer')}
            </p>

        </div>
    );
}

export default MedicalHistory;