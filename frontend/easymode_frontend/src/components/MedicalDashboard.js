// /frontend-react/src/components/MedicalDashboard.js (i18n Enabled)

import React from 'react';
import { useTranslation } from 'react-i18next'; // 1. Import useTranslation
import HeaderBar from './HeaderBar'; 

// --- Local Date Logic (Mocking blinking state) ---
// (No changes to this logic, as it controls behavior, not text)
const APPOINTMENT_DATE_STRING = '2025-12-10T10:00:00'; 
const APPOINTMENT_DATE = new Date(APPOINTMENT_DATE_STRING);
const MOCK_TODAY = new Date('2025-12-08'); 
const MS_PER_DAY = 1000 * 60 * 60 * 24;
const timeDiff = APPOINTMENT_DATE.getTime() - MOCK_TODAY.getTime();
const daysDiff = Math.ceil(timeDiff / MS_PER_DAY);
const isAppointmentSoon = daysDiff >= 0 && daysDiff <= 3;
// --- End Local Date Logic ---


// --- SubIcon Component (Translates ARIA label and renders translated name) ---
const SubIcon = ({ name, emoji, goToPage, pageTarget, isEasyMode, isBlinking }) => {
    // 2. Initialize translation hook inside the component
    const { t } = useTranslation();

    const blinkStyle = isBlinking ? {
        border: '5px solid red', 
        backgroundColor: '#FFE5E5', 
        boxShadow: '0 0 25px rgba(255, 50, 50, 0.9)', 
        transform: 'scale(1.03)',
        animation: 'alert-pulse 1.5s infinite',
    } : {};

    return (
        <div 
            onClick={() => goToPage(pageTarget)}
            style={{
                padding: '20px', 
                margin: '18px 10%', 
                borderRadius: '20px', 
                width: '80%', 
                textAlign: 'center',
                backgroundColor: '#fff', 
                border: '1px solid #ddd', 
                boxShadow: '0 8px 15px rgba(0,0,0,0.1)', 
                cursor: 'pointer',
                transition: 'all 0.3s', 
                overflow: 'hidden',
                ...blinkStyle 
            }}
        >
            {/* Top Section: Emoji */}
            <div style={{ paddingBottom: '10px', borderBottom: '2px solid #007bff20' }}>
                {/* 3. Translate ARIA label */}
                <span role="img" aria-label={t('medical_menu.' + name.toLowerCase().replace(/\s/g, '_'))} style={{
                    fontSize: isEasyMode ? '80px' : '50px', 
                    display: 'block', 
                    marginBottom: '10px'
                }}>{emoji}</span>
            </div>

            {/* Bottom Section: Label/Action */}
            <div style={{ 
                    paddingTop: '10px',
                    backgroundColor: isBlinking ? 'red' : '#1A73E8', 
                    margin: '-20px', 
                    marginTop: '10px'
            }}>
                <p style={{
                    fontWeight: '900', 
                    fontSize: isEasyMode ? '26px' : '20px', 
                    color: 'white', 
                    margin: '0',
                    padding: '12px'
                }}>
                    {/* The name prop is already the translated text passed from the parent function */}
                    {name}
                </p>
            </div>

            {isBlinking && (
                <style jsx>{`
                    @keyframes alert-pulse {
                        0% { opacity: 1; }
                        50% { opacity: 0.7; }
                        100% { opacity: 1; }
                    }
                `}</style>
            )}
        </div>
    );
};

function MedicalDashboard({ isEasyMode, goToPage, onMenuClick }) { 
    // 4. Initialize translation hook
    const { t } = useTranslation();

    return (
        <div style={{ position: 'relative', minHeight: '400px', paddingBottom: '20px' }}>
            
            <HeaderBar
                // 5. Translate the header title
                title={t('header.title_medical_menu')}
                onBackClick={() => goToPage('dashboard')} 
                onMenuClick={onMenuClick} 
                isEasyMode={isEasyMode}
            />
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '15px' }}>
                <SubIcon 
                    // 6. Translate the name before passing it as a prop
                    name={t('medical_menu.appointments_card')} 
                    emoji="🗓️" 
                    pageTarget="appointment" 
                    goToPage={goToPage} 
                    isEasyMode={isEasyMode}
                    isBlinking={isAppointmentSoon}
                />
                <SubIcon 
                    name={t('medical_menu.transportation_card')} 
                    emoji="🚑" 
                    pageTarget="transport" 
                    goToPage={goToPage} 
                    isEasyMode={isEasyMode}
                />
                <SubIcon 
                    name={t('medical_menu.medicine_card')} 
                    emoji="💊" 
                    pageTarget="medicine" 
                    goToPage={goToPage} 
                    isEasyMode={isEasyMode}
                />
            </div>
        </div>
    );
}

export default MedicalDashboard;