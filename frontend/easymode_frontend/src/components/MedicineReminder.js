// /frontend-react/src/components/MedicineReminder.js

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
    const { t } = useTranslation();
    const [isDeliveryConfirmed, setIsDeliveryConfirmed] = useState(false);
    const [isDeliveryNeeded, setIsDeliveryNeeded] = useState(null);
    const [successToastMessage, setSuccessToastMessage] = useState('');
    const [showSuccessToast, setShowSuccessToast] = useState(false);

    const medicine = mockMedicineData;

    // Daily Reminder Logic
    const handleTaken = () => {
        const message = t('medicine.taken_success_alert', { pillName: medicine.medicineName });
        setSuccessToastMessage(message);
        setShowSuccessToast(true);

        setTimeout(() => {
            setShowSuccessToast(false);
            setSuccessToastMessage('');
        }, 3000);
    };

    // Refill Logic Handlers
    const handleRefillDecision = (needed) => {
        setIsDeliveryNeeded(needed);
        if (needed) {
            setTimeout(() => {
                setIsDeliveryConfirmed(true);
            }, 500);
        }
    };

    // Style Config
    const PHONE_MAX_WIDTH = '450px';
    const ctaText = t('medicine.reminder_cta');
    const baseFontSize = isEasyMode ? 36 : 24;
    let buttonFontSize = baseFontSize;

    if (ctaText && ctaText.length > 18) {
        buttonFontSize = isEasyMode ? 28 : 20;
    } else if (ctaText && ctaText.length > 12) {
        buttonFontSize = isEasyMode ? 32 : 22;
    }

    // Daily CTA button
    const descriptiveReminderButtonStyle = {
        padding: '20px',
        backgroundColor: '#4CAF50',
        color: 'white',
        fontSize: isEasyMode ? '24px' : '16px',
        fontWeight: '900',
        borderRadius: '15px',
        width: '90%',
        maxWidth: '350px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        border: 'none',
        cursor: 'pointer',
        boxShadow: '0 8px 20px rgba(0, 70, 0, 0.4)',
        animation: 'pulse-take 1.5s infinite',
        margin: '25px auto 40px auto',
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

    // Toast style — absolute inside the phone wrapper
    const toastStyle = {
        position: 'absolute',               // <- important: absolute inside wrapper
        top: '10px',                        // small offset from top of phone content area
        left: '50%',
        transform: showSuccessToast ? 'translateX(-50%) scale(1)' : 'translateX(-50%) scale(0.95)',
        width: '92%',                       // slightly narrower to avoid touching edges
        maxWidth: PHONE_MAX_WIDTH,
        boxSizing: 'border-box',
        backgroundColor: '#616161',
        color: '#FFFFFF',
        padding: '14px 18px',
        borderRadius: '12px',
        textAlign: 'center',
        fontSize: isEasyMode ? '22px' : '16px',
        fontWeight: 'bold',
        opacity: showSuccessToast ? 1 : 0,
        transition: 'transform 0.28s ease-out, opacity 0.28s ease-out',
        zIndex: 1200,
        pointerEvents: showSuccessToast ? 'auto' : 'none',
        boxShadow: '0 8px 20px rgba(0,0,0,0.45)',
    };

    // Shared Card Style
    const cardStyle = {
        padding: '25px',
        borderRadius: '20px',
        marginBottom: '30px',
        boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
        margin: '0 auto 30px auto',
        maxWidth: '400px'
    };

    return (
        // NOTE: wrapper has position: relative so absolute toast is bounded here
        <div
            style={{
                padding: '0 20px 20px 20px',
                textAlign: 'center',
                maxWidth: PHONE_MAX_WIDTH,
                margin: '0 auto',
                position: 'relative',      // <- make this the positioning context
                minHeight: '100vh',        // ensure there's room for absolute toast
            }}
        >
            {/* Toast (absolute inside the phone wrapper) */}
            <div aria-live="polite" style={toastStyle}>
                ✅ {successToastMessage}
            </div>

            <HeaderBar
                title={t('header.title_medicine')}
                onBackClick={() => goToPage('medical-dashboard')}
                onMenuClick={onMenuClick}
                isEasyMode={isEasyMode}
            />

            <h2 style={{ fontSize: isEasyMode ? '40px' : '30px', margin: '70px 0 10px 0', color: '#1A73E8' }}>
                {t('medicine.reminder_daily')}
            </h2>

            {/* Daily Reminder Button */}
            <button
                onClick={handleTaken}
                style={descriptiveReminderButtonStyle}
            >
                <span style={{ fontSize: isEasyMode ? '60px' : '40px', marginBottom: '10px' }}>
                    💊
                </span>
                <span style={{
                    fontSize: isEasyMode ? '28px' : '20px',
                    fontWeight: 'bold',
                    marginBottom: '5px'
                }}>
                    {medicine.medicineName} ({medicine.dosage})
                </span>
                <span style={{
                    fontSize: buttonFontSize,
                    fontWeight: '900',
                    textDecoration: 'underline'
                }}>
                    {t('medicine.reminder_cta')}
                </span>
            </button>

            <div style={{ marginBottom: '40px' }} />

            {/* Refill Warning */}
            {medicine.isRefillLow && !isDeliveryConfirmed && (
                <div style={{
                    ...cardStyle,
                    border: '4px solid darkred',
                    backgroundColor: '#FFDDDD',
                    animation: 'alert-pulse 1s infinite'
                }}>
                    <h3 style={{ fontSize: isEasyMode ? '36px' : '24px', color: 'darkred' }}>
                        {t('medicine.low_alert')} ⚠️
                    </h3>
                    <p style={{ fontSize: isEasyMode ? '24px' : '18px' }}>
                        {t('medicine.running_out_prefix')} **{medicine.pillsRemaining} {t('medicine.days_label')}**.
                    </p>

                    {/* Refill Question */}
                    {isDeliveryNeeded === null ? (
                        <div>
                            <p style={{ fontSize: isEasyMode ? '28px' : '20px', fontWeight: 'bold' }}>
                                {t('medicine.delivery_question')}
                            </p>
                            <button
                                onClick={() => handleRefillDecision(true)}
                                style={{ ...actionButtonStyle, backgroundColor: 'blue', color: 'white' }}
                            >
                                {t('medicine.delivery_yes_button')} 🚚
                            </button>
                            <button
                                onClick={() => handleRefillDecision(false)}
                                style={{ ...actionButtonStyle, backgroundColor: '#ccc' }}
                            >
                                {t('medicine.delivery_no_button')} 🚶
                            </button>
                        </div>
                    ) : (
                        !isDeliveryNeeded && (
                            <p style={{ fontSize: isEasyMode ? '24px' : '16px', color: 'darkred', fontWeight: 'bold' }}>
                                {t('medicine.pickup_reminder_conf')}
                            </p>
                        )
                    )}
                </div>
            )}

            {/* Delivery Confirmation */}
            {isDeliveryConfirmed && (
                <div style={{
                    ...cardStyle,
                    border: '4px solid green',
                    backgroundColor: '#E6FBE6',
                }}>
                    <h3 style={{ fontSize: isEasyMode ? '36px' : '24px', color: 'green' }}>
                        {t('medicine.delivery_confirmed_header')}
                    </h3>
                    <p style={{ fontSize: isEasyMode ? '24px' : '18px' }}>
                        {t('medicine.courier_label')}: **{medicine.courier.name}**
                    </p>
                    <p style={{ fontSize: isEasyMode ? '24px' : '18px' }}>
                        {t('medicine.eta_label')}: **{medicine.courier.eta}**
                    </p>
                    <span style={{ fontSize: isEasyMode ? '50px' : '30px' }}>📦</span>
                </div>
            )}

            {/* Animations */}
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

