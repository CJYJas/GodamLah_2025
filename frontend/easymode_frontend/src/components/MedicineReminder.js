// /frontend-react/src/components/MedicineReminder.js (FINALIZED & FIXED)

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import HeaderBar from './HeaderBar';

// --- LOCAL MOCK DATA ---
const mockMedicineData = {
    medicineName: "Blood Pressure Pill",
    dosage: "5mg",
    frequency: "Once Daily (Morning)",
    lastTaken: "2025-12-05 08:00 AM",
    pillsRemaining: 10,
    isRefillLow: true, 
    refillDate: "2025-12-12",
    courier: {
        name: "Alex C.",
        deliveryVehicle: "Bike Courier",
        eta: "3 hours",
    }
};

function MedicineReminder({ isEasyMode, goToPage, onMenuClick }) { 
    // HOOKS and LOCAL STATE
    const { t } = useTranslation();
    const [isDeliveryConfirmed, setIsDeliveryConfirmed] = useState(false);
    const [isDeliveryNeeded, setIsDeliveryNeeded] = useState(null); 

    const medicine = mockMedicineData;

    // --- Daily Reminder Logic ---
    const handleTaken = () => {
        console.log("Medicine Taken confirmed!");
        alert(t('medicine.taken_success_alert'));
    };

    // --- Refill Logic Handlers (omitted for brevity) ---
    const handleRefillDecision = (needed) => {
        setIsDeliveryNeeded(needed);
        if (needed) {
            setTimeout(() => {
                setIsDeliveryConfirmed(true);
                console.log("Delivery booked, showing courier status.");
            }, 500);
        } else {
            console.log("Delivery declined.");
        }
    };

    // 🛑 START OF STYLE DECLARATIONS (MODIFIED FOR FONT SIZE) 🛑
    
    // Check length of translated CTA text
    const ctaText = t('medicine.reminder_cta');
    const baseFontSize = isEasyMode ? 36 : 24;
    let buttonFontSize = baseFontSize;

    // 🌟 FIX: Reduce font size if translated text is long to prevent excess height 🌟
    if (ctaText && ctaText.length > 18) {
        buttonFontSize = isEasyMode ? 28 : 20; 
    } else if (ctaText && ctaText.length > 12) {
         buttonFontSize = isEasyMode ? 32 : 22;
    }

    // Style for the main daily reminder button (Time to take now)
    const reminderButtonStyle = {
        padding: '30px 40px',
        backgroundColor: '#4CAF50',
        color: 'white',
        // 🛑 USE DYNAMIC FONT SIZE HERE 🛑
        fontSize: `${buttonFontSize}px`, 
        fontWeight: '900',
        borderRadius: '15px',
        width: '90%',
        maxWidth: '350px', 
        display: 'inline-block',
        border: 'none',
        cursor: 'pointer',
        boxShadow: '0 8px 20px rgba(0, 70, 0, 0.4)',
        animation: 'pulse-take 1.5s infinite',
        margin: '25px 0',
    };

    const actionButtonStyle = {
        padding: '15px 30px',
        fontSize: isEasyMode ? '28px' : '18px',
        borderRadius: '8px',
        border: '2px solid #ccc',
        fontWeight: 'bold',
        cursor: 'pointer',
        margin: '15px 10px',
    };

    // 🛑 END OF STYLE DECLARATIONS 🛑

    return (
        <div style={{ padding: '0 20px 20px 20px', textAlign: 'center' }}>
            <HeaderBar 
                title={t('header.title_medicine')} 
                onBackClick={() => goToPage('medical-dashboard')} 
                onMenuClick={onMenuClick} 
                isEasyMode={isEasyMode} 
            />

            {/* 🛑 FIXED SPACING: Add margin top to clear sticky header 🛑 */}
            <h2 style={{ fontSize: isEasyMode ? '40px' : '30px', margin: '70px 0 10px 0', color: '#1A73E8' }}>
                {t('medicine.reminder_daily')}
            </h2>

            {/* 1. Daily Reminder Action */}
            <button 
                onClick={handleTaken}
                style={reminderButtonStyle} // Uses dynamically sized style
            >
                <span role="img" aria-label={t('medicine.pill_aria_label')} style={{fontSize: isEasyMode ? '60px' : '40px', display: 'block', marginBottom: '10px'}}>💊</span>
                {t('medicine.reminder_cta')}
            </button>

            <p style={{ 
                fontSize: isEasyMode ? '28px' : '18px', 
                color: '#555', 
                marginTop: '15px',
                marginBottom: '40px', 
                fontWeight: 'bold'
            }}>
                {medicine.medicineName} ({medicine.dosage})
            </p>

            {/* 2. Refill Warning Section (No other changes needed here) */}
            {medicine.isRefillLow && !isDeliveryConfirmed && (
                <div style={{
                    marginTop: '30px',
                    padding: '25px', 
                    border: '4px solid darkred', 
                    borderRadius: '20px', 
                    backgroundColor: '#FFDDDD', 
                    boxShadow: '0 0 15px rgba(200, 0, 0, 0.3)',
                    animation: 'alert-pulse 1s infinite'
                }}>
                    <h3 style={{ fontSize: isEasyMode ? '36px' : '24px', margin: '0 0 20px 0', color: 'darkred' }}>
                        {t('medicine.low_alert')} ⚠️
                    </h3>
                    <p style={{ fontSize: isEasyMode ? '24px' : '18px', margin: '15px 0' }}>
                        {t('medicine.running_out_prefix')} **{medicine.pillsRemaining} {t('medicine.days_label')}**.
                    </p>

                    {/* Refill Decision Prompt */}
                    {isDeliveryNeeded === null ? (
                        <div>
                            <p style={{ fontSize: isEasyMode ? '28px' : '20px', fontWeight: 'bold', margin: '20px 0 10px 0' }}>
                                {t('medicine.delivery_question')}
                            </p>
                            <button 
                                onClick={() => handleRefillDecision(true)} 
                                style={{...actionButtonStyle, backgroundColor: 'blue', color: 'white'}}
                            >
                                {t('medicine.delivery_yes_button')} 🚚
                            </button>
                            <button 
                                onClick={() => handleRefillDecision(false)} 
                                style={{...actionButtonStyle, backgroundColor: '#ccc'}}
                            >
                                {t('medicine.delivery_no_button')} 🚶
                            </button>
                        </div>
                    ) : (
                        // Confirmation message for No Delivery
                        !isDeliveryNeeded && (
                            <p style={{ fontSize: isEasyMode ? '24px' : '16px', color: 'darkred', fontWeight: 'bold' }}>
                                {t('medicine.pickup_reminder_conf')}
                            </p>
                        )
                    )}
                </div>
            )}

            {/* 3. Delivery Confirmation Status (No other changes needed here) */}
            {isDeliveryConfirmed && (
                <div style={{
                    marginTop: '30px',
                    padding: '25px',
                    border: '4px solid green',
                    borderRadius: '20px',
                    backgroundColor: '#E6FBE6',
                }}>
                    <h3 style={{ fontSize: isEasyMode ? '36px' : '24px', margin: '0 0 15px 0', color: 'green' }}>
                        {t('medicine.delivery_confirmed_header')}
                    </h3>
                    <p style={{ fontSize: isEasyMode ? '24px' : '18px', margin: '5px 0' }}>
                        {t('medicine.courier_label')}: **{medicine.courier.name}**
                    </p>
                    <p style={{ fontSize: isEasyMode ? '24px' : '18px', margin: '5px 0' }}>
                        {t('medicine.eta_label')}: **{medicine.courier.eta}**
                    </p>
                    <span role="img" aria-label={t('medicine.package_aria_label')} style={{fontSize: isEasyMode ? '50px' : '30px'}}>📦</span>
                </div>
            )}

            {/* CSS Keyframes (remain the same) */}
            <style jsx>{`
                @keyframes pulse-take {
                    0% { box-shadow: 0 0 10px green; }
                    50% { box-shadow: 0 0 20px limegreen; }
                    100% { box-shadow: 0 0 10px green; }
                }
                @keyframes alert-pulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.01); }
                    100% { transform: scale(1); }
                }
            `}</style>
        </div>
    );
}

export default MedicineReminder;