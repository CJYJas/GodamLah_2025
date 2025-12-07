// /frontend-react/src/components/Dashboard.js (Styling Restored)

import React from 'react';
import { useTranslation } from 'react-i18next';

// --- DashboardHeader (Rest of component uses t() and works correctly) ---
const DashboardHeader = ({ onMenuClick, isEasyMode, t }) => ( 
    <div style={{ 
        display: 'flex', 
        justifyContent: 'flex-end', 
        padding: '15px 20px', 
        backgroundColor: 'transparent', 
        position: 'absolute', 
        top: 0,
        right: 0,
        width: '100%',
        zIndex: 15,
    }}>
        <button
            onClick={onMenuClick}
            style={{ 
                padding: '8px',
                backgroundColor: 'transparent', 
                border: 'none', 
                borderRadius: '0', 
                cursor: 'pointer',
                fontSize: isEasyMode ? '36px' : '28px', 
                color: '#333',
                transition: 'color 0.2s',
            }}
            onMouseOver={e => e.currentTarget.style.color = '#1A73E8'} 
            onMouseOut={e => e.currentTarget.style.color = '#333'}
        >
            <span role="img" aria-label={t('general.menu')}>☰</span>
        </button>
    </div>
);
// --- END DashboardHeader ---


// --- Icon Component Modification (Rest of component works correctly) ---
const Icon = ({ name, emoji, isActive, onClick, isProminent, isEasyMode, keyName, color = '#1A73E8', bgColor = '#E8F0FE' }) => {
    
    // ... Icon logic and styling remain the same ...
    const isColored = isActive || isProminent; 
    let iconColor = color;
    let iconBgColor = bgColor;
    
    if (keyName === "dashboard.emergency_info_card") {
        iconColor = '#DC3545';
        iconBgColor = '#FDE9E9';
    } else if (keyName === "dashboard.medical_history_card") {
        iconColor = '#17A2B8';
        iconBgColor = '#E8F7F9';
    }
    
    const baseFontSize = isEasyMode ? 32 : 18;
    let labelFontSize = baseFontSize;

    if (name && name.length > 12) {
        labelFontSize = isEasyMode ? 24 : 16;
    }


    return (
        <div 
            onClick={onClick} 
            style={{
                padding: '25px', 
                margin: '15px',
                border: `5px solid ${isColored ? iconColor : '#e0e0e0'}`,
                borderRadius: '15px', 
                width: '40%',
                textAlign: 'center',
                backgroundColor: isColored ? iconBgColor : '#ffffff',
                filter: isColored ? 'none' : 'grayscale(80%)',
                opacity: isColored ? 1 : 0.7, 
                cursor: 'pointer',
                boxShadow: isColored ? `0 8px 15px ${iconColor}4D` : '0 2px 5px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s',
                fontSize: `${labelFontSize}px`, 
            }}
        >
            <span role="img" aria-label={name} style={{fontSize: isEasyMode ? '85px' : '40px', display: 'block', marginBottom: '10px'}}>{emoji}</span>
            <p style={{fontWeight: 'bold', color: '#333', margin: 0}}>{name}</p>
        </div>
    );
};
// --- END Icon Component Modification ---


function Dashboard({ isEasyMode, goToMedical, onMenuClick, goToEmergencyInfo }) { 
    const { t } = useTranslation();

    const showAppointmentNotification = true; 
    
    // 🛑 RESTORED STYLING: Define the notificationStyle object here 🛑
    const notificationStyle = {
        padding: '15px 25px', 
        margin: '15px', 
        backgroundColor: '#FFF3CD', // Soft yellow/orange alert background
        color: '#856404', 
        textAlign: 'center',
        cursor: 'pointer',
        fontSize: isEasyMode ? '24px' : '16px',
        fontWeight: 'bold',
        borderRadius: '10px',
        borderLeft: '5px solid #FFC107', 
        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
        position: 'relative', 
        zIndex: 10,
    };
    // 🛑 END RESTORED STYLING 🛑


    return (
        <div style={{ position: 'relative' }}>
            <DashboardHeader onMenuClick={onMenuClick} isEasyMode={isEasyMode} t={t} />

            {/* RENDER THE NOTIFICATION BANNER (Now uses the restored notificationStyle) */}
            {showAppointmentNotification && (
                <div onClick={goToMedical} style={notificationStyle}>
                    <span role="img" aria-label={t('general.alert')} style={{marginRight: '10px'}}>🔔</span>
                    {t('dashboard.appointment_soon_alert')} {t('general.tap_here')}
                </div>
            )}

            {/* MAIN ICON GRID (Rest of the component remains the same) */}
            <div style={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                justifyContent: 'center', 
                paddingTop: showAppointmentNotification ? '20px' : '40px', 
                paddingBottom: '40px' 
            }}>
                
                {/* Icons... */}
                <Icon 
                    name={t('medical_menu.access_card_short')} 
                    emoji="🏥" 
                    isActive={true} 
                    onClick={goToMedical} 
                    isEasyMode={isEasyMode}
                    keyName={'medical_menu.access_card_short'} 
                />
                
                <Icon 
                    name={t('dashboard.emergency_info_card')} 
                    emoji="🆘" 
                    isProminent={true} 
                    isActive={false} 
                    onClick={goToEmergencyInfo} 
                    isEasyMode={isEasyMode}
                    keyName={'dashboard.emergency_info_card'} 
                />
                
                <Icon 
                    name={t('dashboard.medical_history_card')} 
                    emoji="📜" 
                    isProminent={true} 
                    isActive={false} 
                    onClick={() => console.log('Medical History page route needed.')}
                    isEasyMode={isEasyMode}
                    keyName={'dashboard.medical_history_card'} 
                />
                
                <div style={{ width: '40%', margin: '15px', visibility: 'hidden' }}></div>
            </div>
        </div>
    );
}

export default Dashboard;