// /frontend-react/src/components/Dashboard.js (FINALIZED & COMPLETE)

import React from 'react';

// --- DashboardHeader: Simplified Menu Icon ---
const DashboardHeader = ({ onMenuClick, isEasyMode }) => (
    <div style={{ 
        display: 'flex', 
        justifyContent: 'flex-end', 
        padding: '15px 20px', 
        backgroundColor: 'transparent', 
        position: 'absolute', 
        top: 0,
        right: 0,
        width: '100%',
        zIndex: 15, // Ensures the menu icon is tappable over the notification
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
            <span role="img" aria-label="Menu">☰</span>
        </button>
    </div>
);
// --- END DashboardHeader ---


// --- Icon Component Modification (Handles different colors) ---
const Icon = ({ name, emoji, isActive, onClick, isProminent, isEasyMode, color = '#1A73E8', bgColor = '#E8F0FE' }) => {
    // If isProminent is true, we force the coloring even if isActive is false.
    const isColored = isActive || isProminent; 

    // Define specific colors based on the icon's role
    let iconColor = color;
    let iconBgColor = bgColor;
    
    if (name === "Emergency Info") {
        iconColor = '#DC3545'; // Red for SOS
        iconBgColor = '#FDE9E9';
    } else if (name === "Medical History") {
        iconColor = '#17A2B8'; // Cyan/Teal for History
        iconBgColor = '#E8F7F9';
    }


    return (
        <div 
            // Clicks fire if the icon is active (blue) OR if it is a colored, prominent route (SOS/History)
            onClick={onClick} 
            style={{
                padding: '25px', 
                margin: '15px',
                border: `5px solid ${isColored ? iconColor : '#e0e0e0'}`, // Color border
                borderRadius: '15px', 
                width: '40%',
                textAlign: 'center',
                backgroundColor: isColored ? iconBgColor : '#ffffff', // Color background
                filter: isColored ? 'none' : 'grayscale(80%)', // No grayscale if colored
                opacity: isColored ? 1 : 0.7, 
                cursor: 'pointer', // Always pointer since icons are primary navigation
                boxShadow: isColored ? `0 8px 15px ${iconColor}4D` : '0 2px 5px rgba(0, 0, 0, 0.1)', // Subtle colored shadow
                transition: 'all 0.3s',
                
                // FONT SIZE ADJUSTMENT FOR TEXT FIT
                fontSize: isEasyMode ? '32px' : '18px',
            }}
        >
            <span role="img" aria-label={name} style={{fontSize: isEasyMode ? '85px' : '40px', display: 'block', marginBottom: '10px'}}>{emoji}</span>
            <p style={{fontWeight: 'bold', color: '#333', margin: 0}}>{name}</p>
        </div>
    );
};
// --- END Icon Component Modification ---


function Dashboard({ isEasyMode, goToMedical, onMenuClick, goToEmergencyInfo }) { 
    
    const showAppointmentNotification = true; 

    // NOTE: goToMedical handles navigation for both the active icon and the notification banner.
    
    // --- REVISED NOTIFICATION STYLE (Floating Card) ---
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


    return (
        <div style={{ position: 'relative' }}>
            {/* RENDER THE MENU ICON AT THE TOP RIGHT */}
            <DashboardHeader onMenuClick={onMenuClick} isEasyMode={isEasyMode} />

            {/* RENDER THE NOTIFICATION BANNER */}
            {showAppointmentNotification && (
                <div 
                    // Notification uses goToMedical, which App.js sets to 'medical-dashboard'
                    onClick={goToMedical} 
                    style={notificationStyle}
                >
                    <span role="img" aria-label="Alert" style={{marginRight: '10px'}}>🔔</span>
                    APPOINTMENT SOON! Tap Here.
                </div>
            )}

            {/* MAIN ICON GRID - FINAL SYMMETRICAL 2X2 ALIGNMENT */}
            <div style={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                justifyContent: 'center', 
                paddingTop: showAppointmentNotification ? '20px' : '40px', 
                paddingBottom: '40px' 
            }}>
                {/* 1. MEDICAL ACCESS (Active Feature) - Uses goToMedical (Menu route) */}
                <Icon name="Medical Access" emoji="🏥" isActive={true} onClick={goToMedical} isEasyMode={isEasyMode}/>
                
                {/* 2. EMERGENCY INFO - Uses the dedicated goToEmergencyInfo prop (Page route) */}
                <Icon 
                    name="Emergency Info" 
                    emoji="🆘" 
                    isProminent={true} 
                    isActive={false} 
                    onClick={goToEmergencyInfo} 
                    isEasyMode={isEasyMode}
                />
                
                {/* Row 2 */}
                {/* 3. MEDICAL HISTORY - Not yet linked, will console log */}
                <Icon 
                    name="Medical History" 
                    emoji="📜" 
                    isProminent={true} 
                    isActive={false} 
                    onClick={() => console.log('Medical History page route needed.')}
                    isEasyMode={isEasyMode}
                />
                
                {/* HIDDEN SPACER ICON: Maintains the 2x2 centered structure */}
                <div style={{ width: '40%', margin: '15px', visibility: 'hidden' }}></div>
            </div>
        </div>
    );
}

export default Dashboard;