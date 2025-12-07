// /frontend-react/src/components/AppointmentFlow.js

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import HeaderBar from './HeaderBar';
import OtherNeedInput from './OtherNeedInput'; 

// --- FlowButton Component (Modified for dynamic font size) ---
const FlowButton = ({ label, emoji, isBlinking, onClick, isEasyMode, primaryColor = '#007bff' }) => {
    // ... (FlowButton logic remains the same) ...
    const baseFontSize = isEasyMode ? 24 : 18;
    let labelFontSize = baseFontSize;

    if (label && label.length > 15) {
        labelFontSize = isEasyMode ? 18 : 14; 
    } else if (label && label.length > 10) {
        labelFontSize = isEasyMode ? 20 : 16;
    }
    
    return (
        <button 
            onClick={onClick}
            style={{
                padding: '20px 10px', 
                margin: '10px 5px', 
                border: `4px solid ${isBlinking ? primaryColor : '#ccc'}`,
                backgroundColor: isBlinking ? '#ffffcc' : 'white',
                fontWeight: 'bold',
                fontSize: `${labelFontSize}px`, 
                animation: isBlinking ? 'pulse 1.5s infinite' : 'none',
                cursor: 'pointer',
                transition: 'all 0.3s',
                borderRadius: '10px',
                color: '#333',
                width: '30%',
                minWidth: '100px',
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                overflowWrap: 'break-word',
                wordBreak: 'break-word',
            }}
        >
            <span role="img" aria-label={label} style={{fontSize: isEasyMode ? '50px' : '30px', display: 'block', marginBottom: '5px'}}>{emoji}</span>
            {label}
        </button>
    );
};

// <<< APPOINTMENT FLOW MAIN COMPONENT >>>
function AppointmentFlow({ isEasyMode, appointment, goToTransportStatus, goToMedicalDashboard, onMenuClick, onTransportBooked }) {
    const { t } = useTranslation();

    const [step, setStep] = useState(0); 
    const [needsTransport, setNeedsTransport] = useState(null); 
    const [transportNeed, setTransportNeed] = useState(null); 
    const [showOtherInput, setShowOtherInput] = useState(false); 
    const [customNeedText, setCustomNeedText] = useState('');

    // --- API INTEGRATION: SEND TRANSPORT DATA ---
    const sendTransportData = async () => {
        const finalNeed = transportNeed === 'other' ? customNeedText : transportNeed;
        
        try {
            const response = await fetch('http://localhost:5000/api/set_transport', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ transport_need: finalNeed }),
            });

            if (!response.ok) {
                throw new Error('Failed to save transport need on backend.');
            }
            
            // 1. Update local state in App.js immediately
            onTransportBooked(finalNeed); 
            
            // 2. Proceed to next steps
            setStep(3); 
            setTimeout(goToTransportStatus, 2000); 
            
        } catch (error) {
            console.error("Error booking transport:", error);
            alert("Failed to book transport due to a network error.");
        }
    };
    
    // --- SEND NO TRANSPORT (local redirect, no transport saved) ---
    const sendNoTransportData = () => {
        // Clear transport state if user explicitly selects No
        onTransportBooked(null); 
        console.log('--- Data Sent: NO TRANSPORT NEEDED, APPOINTMENT CONFIRMED ---');
        setStep(3); 
        setTimeout(goToMedicalDashboard, 2000); 
    };

    // ... (rest of helper functions remain the same) ...

    const handleConfirmOtherNeed = (text) => { setCustomNeedText(text); setTransportNeed('other'); setShowOtherInput(false); };
    const handleCancelOtherNeed = () => { setTransportNeed(null); setShowOtherInput(false); };
    const handleNeedSelection = (key) => { if (key === 'other') { setShowOtherInput(true); } else { setTransportNeed(key); } };

    const getBlinkingStyle = (currentStep) => ({
        border: `5px solid ${step === currentStep ? '#FFC107' : '#ddd'}`, 
        backgroundColor: step === currentStep ? '#FFFBEA' : '#ffffff',
        boxShadow: step === currentStep ? '0 0 15px rgba(255,193,7,0.8)' : '0 2px 5px rgba(0,0,0,0.1)',
        animation: step === currentStep ? 'pulse 1.5s infinite' : 'none', 
    });

    const transportOptions = [
        { key: 'bedridden', label: t('transport_needs.bed'), emoji: '🛏️' },
        { key: 'wheelchair', label: t('transport_needs.chair'), emoji: '♿' },
        { key: 'slow', label: t('transport_needs.slow'), emoji: '🚶' },
        { key: 'general', label: t('transport_needs.general'), emoji: '👤' },
        { key: 'other', label: t('transport_needs.other'), emoji: '❓' },
    ];

    if (showOtherInput) {
        return (
            <OtherNeedInput 
                isEasyMode={isEasyMode}
                onConfirmNeed={handleConfirmOtherNeed}
                onCancel={handleCancelOtherNeed}
            />
        );
    }
    

    return (
        <div style={{ padding: '0 20px 20px 20px', textAlign: 'center' }}>
            <HeaderBar 
                title={t('header.title_appointment')} 
                onBackClick={goToMedicalDashboard} 
                onMenuClick={onMenuClick} 
                isEasyMode={isEasyMode}
            />
            
            {/* 1. Date/Time Area - Pushes content down 70px */}
            <div 
                style={{
                    padding: '30px', 
                    marginTop: '70px',
                    marginBottom: '20px', 
                    borderRadius: '15px', 
                    ...getBlinkingStyle(0),
                    fontSize: isEasyMode ? '48px' : '24px',
                    fontWeight: 'bold',
                }}
            >
                <p style={{margin: 0, color: '#333'}}>{appointment.date}</p>
                <p style={{margin: 0, color: '#1A73E8'}}>{appointment.time}</p>
            </div>

            {/* 2. Do you need transport? - Blinks on Step 1 */}
            <div 
                style={{...getBlinkingStyle(1), padding: '20px', borderRadius: '15px', marginBottom: '20px'}}
                onClick={() => step === 1 && console.log("Audio: 'Do you need a ride?'")}
            >
                <span 
                    role="img" 
                    aria-label={t('appointment_flow.transport_question_aria')} 
                    style={{fontSize: isEasyMode ? '60px' : '40px', display: 'block', margin: '0 0 10px 0'}}
                >
                    🚗❓
                </span>
                <p style={{fontSize: isEasyMode ? '20px' : '16px', fontWeight: 'bold', margin: '0 0 15px 0', color: '#555'}}>
                    {t('appointment_flow.tap_instruction')}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                    <FlowButton label={t('general.yes')} emoji="✅" isBlinking={step === 1} isEasyMode={isEasyMode} onClick={() => { setNeedsTransport(true); setStep(2); }} primaryColor="green"/>
                    <FlowButton label={t('general.no')} emoji="❌" isBlinking={step === 1} isEasyMode={isEasyMode} onClick={() => { setNeedsTransport(false); sendNoTransportData(); }} primaryColor="red"/>
                </div>
            </div>
            
            {/* 3. Choose Needs - Blinks on Step 2 */}
            {step >= 2 && needsTransport && (
                <div style={{...getBlinkingStyle(2), padding: '20px', borderRadius: '15px'}}>
                    <h3 style={{fontSize: isEasyMode ? '32px' : '20px', margin: '0 0 15px 0', color: '#555'}}>
                        {t('appointment_flow.select_need_prompt')}
                    </h3>
                    
                    <div style={{ 
                        display: 'flex', 
                        flexWrap: 'wrap', 
                        justifyContent: 'center',
                        gap: '5px' 
                    }}>
                        {transportOptions.map(option => (
                            <FlowButton
                                key={option.key}
                                label={option.label}
                                emoji={option.emoji}
                                isBlinking={step === 2 && transportNeed !== option.key}
                                isEasyMode={isEasyMode}
                                onClick={() => handleNeedSelection(option.key)}
                                primaryColor={option.key === 'other' ? 'purple' : '#1A73E8'}
                            />
                        ))}
                    </div>

                    {/* Display recorded text if 'other' is confirmed */}
                    {transportNeed === 'other' && customNeedText && (
                        <div style={{marginTop: '15px', padding: '10px', border: '1px dashed green', borderRadius: '5px'}}>
                             <p style={{fontSize: isEasyMode ? '20px' : '14px', margin: 0}}>
                                 **{t('appointment_flow.confirmed_need_label')}:** {customNeedText}
                             </p>
                        </div>
                    )}
                    
                    {transportNeed && (
                        <button
                            onClick={sendTransportData}
                            style={{ 
                                padding: '15px 40px', 
                                fontSize: isEasyMode ? '24px' : '16px', // Reduced font size for multi-lang fit
                                backgroundColor: 'green', 
                                color: 'white', 
                                border: 'none', 
                                borderRadius: '10px', 
                                marginTop: '20px', 
                                fontWeight: 'bold'
                            }}
                        >
                            {t('appointment_flow.confirm_book_button')}
                        </button>
                    )}
                </div>
            )}
            
            {/* 4. Final State */}
            {step === 3 && (
                <div style={{ marginTop: '20px', color: 'green', fontWeight: 'bold', fontSize: isEasyMode ? '48px' : '24px' }}>
                    ✅ {needsTransport ? t('appointment_flow.transport_booked_success') : t('appointment_flow.appointment_confirmed_success')}
                </div>
            )}
            <style jsx>{`
                @keyframes pulse {
                    0% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.01); opacity: 0.8; }
                    100% { transform: scale(1); opacity: 1; }
                }
            `}</style>
        </div>
    );
}

export default AppointmentFlow;