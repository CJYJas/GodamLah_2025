import React from 'react';
import { useTranslation } from 'react-i18next';

// --- DashboardMenuButton ---
const DashboardMenuButton = ({ onMenuClick, isEasyMode, t }) => ( 
    <div style={{ 
        position: 'absolute',
        top: '15px',
        right: '15px',
        zIndex: 110,
    }}>
        <button
            onClick={onMenuClick}
            style={{ 
                padding: '0', 
                backgroundColor: 'transparent', 
                border: 'none', 
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
// --- END DashboardMenuButton ---

// --- Icon Component ---
const Icon = ({ name, emoji, isActive, onClick, isProminent, isEasyMode, keyName, color = '#1A73E8', bgColor = '#E8F0FE' }) => {
    const isColored = isActive || isProminent; 
    let iconColor = color;
    let iconBgColor = '#E8F0FE'; 
    
    if (keyName === "dashboard.emergency_info_card") {
        iconColor = '#DC3545';
        iconBgColor = '#FDE9E9';
    } else if (keyName === "medical_menu.access_card_short") {
        iconColor = '#1A73E8';
        iconBgColor = '#E8F0FE';
    } else if (keyName === "dashboard.medical_history_card") {
        iconColor = '#17A2B8';
        iconBgColor = '#E8F7F9';
    }
    
    const baseFontSize = isEasyMode ? 32 : 18;
    let labelFontSize = baseFontSize;
    if (name && name.length > 12) labelFontSize = isEasyMode ? 24 : 16;

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
// --- END Icon ---

function Dashboard({ isEasyMode, goToMedical, onMenuClick, goToEmergencyInfo, goToPage }) { 
    const { t } = useTranslation();
    const showAppointmentNotification = true; 
    
    const notificationStyle = {
        padding: '10px 15px', 
        margin: '0 15px 25px 15px',
        backgroundColor: '#FFF3CD', 
        color: '#856404', 
        cursor: 'pointer',
        fontWeight: 'bold',
        borderRadius: '10px', 
        border: '2px solid #FFC107', 
        boxShadow: '0 8px 15px rgba(255, 193, 7, 0.3)',
        zIndex: 10, 
        display: 'flex', 
        alignItems: 'center',
        width: 'auto', 
        boxSizing: 'border-box',
        animation: 'blink-alert 1.8s infinite alternate', 
    };

    const textContainerStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        marginLeft: '15px', 
        flexGrow: 1, 
    };

    const bellStyle = {
        fontSize: isEasyMode ? '30px' : '22px', 
        color: '#FFC107',
        textShadow: '0 0 5px rgba(255, 193, 7, 0.8)',
    };

    const headingStyle = { fontSize: isEasyMode ? '24px' : '16px', margin: '0', lineHeight: '1.2', fontWeight: 'bold' };
    const tapHereStyle = { fontSize: isEasyMode ? '32px' : '22px', margin: '0', lineHeight: '1.2', fontWeight: '900' };

    return (
        <div style={{ position: 'relative' }}>
            <DashboardMenuButton onMenuClick={onMenuClick} isEasyMode={isEasyMode} t={t} />

            <div style={{ paddingTop: '60px' }}>
                {showAppointmentNotification && (
                    <div onClick={goToMedical} style={notificationStyle}>
                        <span role="img" aria-label={t('general.alert')} style={bellStyle}>🔔</span>
                        <div style={textContainerStyle}>
                            <p style={headingStyle}>{t('dashboard.appointment_soon_alert')}</p>
                            <p style={tapHereStyle}>{t('general.tap_here')}</p>
                        </div>
                    </div>
                )}

                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', paddingTop: '15px', paddingBottom: '40px' }}>
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
                        onClick={() => goToPage('medical-history')} // <-- navigates
                        isEasyMode={isEasyMode}
                        keyName={'dashboard.medical_history_card'} 
                    />

                    <div style={{ width: '40%', margin: '15px', visibility: 'hidden' }}></div>
                </div>
            </div>

            <style jsx>{`
                @keyframes blink-alert {
                    0% { box-shadow: 0 8px 15px rgba(255, 193, 7, 0.4); transform: scale(1); }
                    50% { box-shadow: 0 8px 25px rgba(255, 193, 7, 0.8); transform: scale(1.005); }
                    100% { box-shadow: 0 8px 15px rgba(255, 193, 7, 0.4); transform: scale(1); }
                }
            `}</style>
        </div>
    );
}

export default Dashboard;
