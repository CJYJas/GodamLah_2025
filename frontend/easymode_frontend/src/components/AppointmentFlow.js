// /frontend-react/src/components/AppointmentFlow.js

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import HeaderBar from './HeaderBar';
import OtherNeedInput from './OtherNeedInput'; 

// --- New: Appointment Change Modal Component ---
const ChangeAppointmentModal = ({ isEasyMode, onClose, onTimeSelect, currentAppointment, t }) => {
    const availableTimes = [
        { date: 'Tuesday, 14 Dec 2025', time: '10:30 AM' },
        { date: 'Wednesday, 15 Dec 2025', time: '2:00 PM' },
        { date: 'Thursday, 16 Dec 2025', time: '9:00 AM' },
    ];
    
    const fontSize = isEasyMode ? '20px' : '16px';

    return (
        <div style={{
            position: 'absolute', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            backgroundColor: 'rgba(0, 0, 0, 0.7)', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            zIndex: 1000,
            padding: '20px'
        }}>
            <div style={{
                backgroundColor: 'white', 
                padding: '25px', 
                borderRadius: '15px', 
                width: '90%', 
                maxWidth: '350px', 
                textAlign: 'center', 
                boxShadow: '0 5px 15px rgba(0,0,0,0.3)'
            }}>
                <h3 style={{ fontSize: isEasyMode ? '32px' : '22px', margin: '0 0 10px 0' }}>
                    🗓️ {t('modal.change_appointment_title')}
                </h3>
                <p style={{ fontSize: isEasyMode ? '18px' : '14px', margin: '0 0 20px 0', color: '#555' }}>
                    {t('modal.change_appointment_prompt')}
                </p>
                <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '20px' }}>
                    {availableTimes.map((time, index) => (
                        <button
                            key={index}
                            onClick={() => onTimeSelect(time)}
                            style={{
                                width: '100%', padding: '15px', margin: '5px 0', 
                                border: '2px solid #1A73E8', borderRadius: '8px', 
                                backgroundColor: '#E3F2FD', color: '#1A73E8', 
                                fontSize: fontSize, fontWeight: 'bold', cursor: 'pointer',
                                transition: 'background-color 0.2s',
                                textAlign: 'left',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}
                        >
                            <span style={{flexGrow: 1}}>{time.date}</span>
                            <span style={{ fontWeight: 'normal', fontSize: '0.9em' }}>{time.time}</span>
                        </button>
                    ))}
                </div>
                <button
                    onClick={onClose}
                    style={{
                        padding: '10px 20px', fontSize: fontSize, 
                        backgroundColor: '#ccc', color: '#333', border: 'none', 
                        borderRadius: '8px', cursor: 'pointer', marginTop: '10px'
                    }}
                >
                    {t('general.cancel')}
                </button>
            </div>
        </div>
    );
};

// --- FlowButton Component ---
const FlowButton = ({ label, emoji, isBlinking, onClick, isEasyMode, primaryColor = '#007bff', customWidth = '30%' }) => {
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
                width: customWidth, 
                minWidth: '100px',
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center', 
                overflowWrap: 'break-word',
                wordBreak: 'break-word',
                height: 'auto', 
            }}
        >
            <span 
                role="img" 
                aria-label={label} 
                style={{
                    fontSize: isEasyMode ? '50px' : '30px', 
                    display: 'block', 
                    // Adjusted margin bottom for better alignment of short words like Confirm/Change
                    marginBottom: '3px' 
                }}
            >
                {emoji}
            </span>
            {label}
        </button>
    );
};

// <<< APPOINTMENT FLOW MAIN COMPONENT >>>
function AppointmentFlow({ isEasyMode, appointment: initialAppointment, goToTransportStatus, goToMedicalDashboard, onMenuClick, onTransportBooked, onAppointmentChange }) {
    const { t } = useTranslation();
    
    // Initialize appointment state: If initialAppointment is null/undefined, use hardcoded mock data.
    const mockAppointment = { date: 'Tuesday, 10 Dec 2025', time: '10:00 AM' }; // Hardcoded mock
    
    const [appointment, setAppointment] = useState(
        initialAppointment && initialAppointment.date 
            ? initialAppointment 
            : mockAppointment 
    ); 

    // Sync local state with prop when initialAppointment changes (i.e., when data loads asynchronously)
    useEffect(() => {
        // Only update if a valid appointment is passed and it differs from the current local state
        if (initialAppointment && initialAppointment.date && 
            (initialAppointment.date !== appointment.date || initialAppointment.time !== appointment.time)) {
            setAppointment(initialAppointment);
        }
    }, [initialAppointment]); 
    
    const [step, setStep] = useState(1); 
    const [needsTransport, setNeedsTransport] = useState(null); 
    const [transportNeed, setTransportNeed] = useState(null); 
    const [showOtherInput, setShowOtherInput] = useState(false); 
    const [customNeedText, setCustomNeedText] = useState('');
    const [showChangeModal, setShowChangeModal] = useState(false); 
    const [isAppointmentConfirmed, setIsAppointmentConfirmed] = useState(false); 

    // --- Handlers ---
    const handleOpenChangeModal = () => setShowChangeModal(true);
    const handleCloseChangeModal = () => setShowChangeModal(false);
    
    const handleTimeSelection = async (newTime) => {
        setAppointment(newTime); 
        
        // --- API INTEGRATION: SEND NEW APPOINTMENT DATE ---
        try {
            const response = await fetch('http://localhost:5000/api/set_appointment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newTime),
            });

            if (!response.ok) {
                throw new Error('Failed to save new appointment time on backend.');
            }
            console.log("New appointment time saved successfully on backend.");
            
            if (onAppointmentChange) {
                onAppointmentChange(newTime);
            }
        } catch (error) {
            console.error("Error changing appointment:", error);
            alert("Failed to save the new appointment time due to a network error.");
        }
        
        setShowChangeModal(false); 
        // Reset confirmation state if user changes time after confirming
        setIsAppointmentConfirmed(false); 
        setStep(1); 
    };

    const handleConfirmAppointment = () => {
        // Use the mock date for comparison if the prop wasn't provided (to avoid waiting for the async t() value)
        const loadingText = t('general.loading_transport_info');
        if (appointment.date === loadingText && initialAppointment === undefined) { 
             // This case is avoided by using mockAppointment, but kept as a safeguard
             alert("Please wait for appointment details to load or refresh the page.");
             return;
        }
        setIsAppointmentConfirmed(true);
        setStep(2); // Move to Transport Question step
    };


    // --- API INTEGRATION: SEND TRANSPORT DATA (Step 3) ---
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
            
            onTransportBooked(finalNeed); 
            
            setStep(4); // Final step
            setTimeout(goToTransportStatus, 2000); 
            
        } catch (error) {
            console.error("Error booking transport:", error);
            alert("Failed to book transport due to a network error.");
        }
    };
    
    // --- SEND NO TRANSPORT (Step 2) ---
    const sendNoTransportData = () => {
        onTransportBooked(null); 
        console.log('--- Data Sent: NO TRANSPORT NEEDED, APPOINTMENT CONFIRMED ---');
        setStep(4); // Final step
        setTimeout(goToMedicalDashboard, 2000); 
    };

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
    
    // RENDER MODAL FIRST
    if (showChangeModal) {
        return (
            <ChangeAppointmentModal 
                isEasyMode={isEasyMode}
                onClose={handleCloseChangeModal}
                onTimeSelect={handleTimeSelection}
                currentAppointment={appointment}
                t={t} 
            />
        );
    }

    return (
        <div style={{ 
            maxWidth: '450px', 
            margin: '0 auto', 
            minHeight: '80vh', 
            position: 'relative', 
            padding: '0 20px 20px 20px', 
            textAlign: 'center' 
        }}>
            <HeaderBar 
                title={t('header.title_appointment')} 
                onBackClick={goToMedicalDashboard} 
                onMenuClick={onMenuClick} 
                isEasyMode={isEasyMode}
            />
            
            {/* 1. Appointment Confirmation / Date Display - Blinks on Step 1 */}
            <div 
                style={{
                    padding: '30px', 
                    marginTop: '70px',
                    marginBottom: '20px', 
                    borderRadius: '15px', 
                    ...getBlinkingStyle(1), 
                    fontSize: isEasyMode ? '48px' : '24px',
                    fontWeight: 'bold',
                }}
            >
                {/* Date/Time - Renders from local 'appointment' state */}
                <p style={{margin: 0, color: '#333'}}>
                    {appointment.date}
                </p>
                <p style={{margin: 0, color: '#1A73E8'}}>
                    {appointment.time}
                </p>
                
                {step === 1 && (
                    <div style={{ marginTop: '20px' }}>
                        <p style={{fontSize: isEasyMode ? '24px' : '18px', margin: '0 0 15px 0', color: '#555'}}>
                            {t('appointment_flow.confirm_prompt')}
                        </p>
                        <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-around',
                            padding: '0 5px' 
                        }}>
                            {/* CONFIRM BUTTON */}
                            <FlowButton 
                                label={t('general.confirm')} 
                                emoji="👍" 
                                isBlinking={true} 
                                isEasyMode={isEasyMode} 
                                onClick={handleConfirmAppointment} 
                                primaryColor="green"
                                customWidth="45%" 
                            />
                            {/* CHANGE BUTTON */}
                            <FlowButton 
                                label={t('general.change')} 
                                emoji="🔄" 
                                isBlinking={true} 
                                isEasyMode={isEasyMode} 
                                onClick={handleOpenChangeModal} 
                                primaryColor="orange"
                                customWidth="45%" 
                            />
                        </div>
                    </div>
                )}

                {/* Show a confirmation message if confirmed, and step is > 1 */}
                {isAppointmentConfirmed && step > 1 && (
                    <p style={{fontSize: isEasyMode ? '20px' : '16px', margin: 0, color: 'green'}}>
                        ✅ {t('appointment_flow.confirmed_message')}
                    </p>
                )}
            </div>

            {/* 2. Do you need transport? - Blinks on Step 2 */}
            {isAppointmentConfirmed && (
                <div 
                    style={{
                        ...getBlinkingStyle(2), 
                        padding: '20px', 
                        borderRadius: '15px', 
                        marginBottom: '20px',
                        display: step >= 2 ? 'block' : 'none' 
                    }}
                    onClick={() => step === 2 && console.log("Audio: 'Do you need a ride?'")}
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
                        <FlowButton label={t('general.yes')} emoji="✅" isBlinking={step === 2} isEasyMode={isEasyMode} onClick={() => { setNeedsTransport(true); setStep(3); }} primaryColor="green"/>
                        <FlowButton label={t('general.no')} emoji="❌" isBlinking={step === 2} isEasyMode={isEasyMode} onClick={() => { setNeedsTransport(false); sendNoTransportData(); }} primaryColor="red"/>
                    </div>
                </div>
            )}
            
            {/* 3. Choose Needs - Blinks on Step 3 */}
            {step >= 3 && needsTransport && (
                <div style={{...getBlinkingStyle(3), padding: '20px', borderRadius: '15px'}}>
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
                                isBlinking={step === 3 && transportNeed !== option.key}
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
            {step === 4 && (
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