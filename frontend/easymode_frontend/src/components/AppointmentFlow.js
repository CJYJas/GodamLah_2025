// /frontend-react/src/components/AppointmentFlow.js

import React, { useState } from 'react';
import HeaderBar from './HeaderBar';
import OtherNeedInput from './OtherNeedInput'; // Import the new component

const FlowButton = ({ label, emoji, isBlinking, onClick, isEasyMode, primaryColor = '#007bff' }) => (
    <button 
        onClick={onClick}
        style={{
            padding: '20px 10px', 
            margin: '10px 5px', 
            border: `4px solid ${isBlinking ? primaryColor : '#ccc'}`,
            backgroundColor: isBlinking ? '#ffffcc' : 'white',
            fontWeight: 'bold',
            fontSize: isEasyMode ? '24px' : '18px',
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
        }}
    >
        <span role="img" aria-label={label} style={{fontSize: isEasyMode ? '50px' : '30px', display: 'block', marginBottom: '5px'}}>{emoji}</span>
        {label}
    </button>
);

// <<< ADD onMenuClick PROP TO FUNCTION SIGNATURE >>>
function AppointmentFlow({ isEasyMode, appointment, goToTransportStatus, goToMedicalDashboard, onMenuClick }) {
    // Core flow state
    const [step, setStep] = useState(0); 
    const [needsTransport, setNeedsTransport] = useState(null); 
    const [transportNeed, setTransportNeed] = useState(null); 

    // State for Other Need Input
    const [showOtherInput, setShowOtherInput] = useState(false); 
    const [customNeedText, setCustomNeedText] = useState('');

    // --- Core Logic Functions ---
    const sendTransportData = () => {
        const finalNeed = transportNeed === 'other' ? customNeedText : transportNeed;
        console.log('--- Data Sent: TRANSPORT BOOKED ---', { finalNeed });
        setStep(3); 
        setTimeout(goToTransportStatus, 2000); // Redirect to status page
    };
    
    const sendNoTransportData = () => {
        console.log('--- Data Sent: NO TRANSPORT NEEDED, APPOINTMENT CONFIRMED ---');
        setStep(3); 
        setTimeout(goToMedicalDashboard, 2000); // Redirect back to Medical Menu after success
    };

    // --- Other Input Handlers ---
    const handleConfirmOtherNeed = (text) => {
        setCustomNeedText(text); 
        setTransportNeed('other'); 
        setShowOtherInput(false); 
    };

    const handleCancelOtherNeed = () => {
        setTransportNeed(null); 
        setShowOtherInput(false); 
    };
    
    // Handler for all button selections (redirects for 'other')
    const handleNeedSelection = (key) => {
        if (key === 'other') {
            setShowOtherInput(true); 
        } else {
            setTransportNeed(key);
        }
    };
    // ----------------------------

    const getBlinkingStyle = (currentStep) => ({
        border: `5px solid ${step === currentStep ? '#FFC107' : '#ddd'}`, 
        backgroundColor: step === currentStep ? '#FFFBEA' : '#ffffff',
        boxShadow: step === currentStep ? '0 0 15px rgba(255,193,7,0.8)' : '0 2px 5px rgba(0,0,0,0.1)',
        animation: step === currentStep ? 'pulse 1.5s infinite' : 'none', 
    });

    const transportOptions = [
        { key: 'bedridden', label: 'Bed', emoji: '🛏️' },
        { key: 'wheelchair', label: 'Chair', emoji: '♿' },
        { key: 'slow', label: 'Slow', emoji: '🚶' },
        { key: 'general', label: 'General', emoji: '👤' },
        { key: 'other', label: 'Other', emoji: '❓' },
    ];

    // --- Conditional Rendering for Other Input Screen ---
    if (showOtherInput) {
        return (
            <OtherNeedInput 
                isEasyMode={isEasyMode}
                onConfirmNeed={handleConfirmOtherNeed}
                onCancel={handleCancelOtherNeed}
            />
        );
    }
    // ----------------------------------------------------

    return (
        <div style={{ padding: '0 20px 20px 20px', textAlign: 'center' }}>
            {/* <<< ADDED HEADER BAR WITH MENU CLICK HANDLER >>> */}
            <HeaderBar 
                title="Appointment" 
                onBackClick={goToMedicalDashboard} 
                onMenuClick={onMenuClick} // Pass the handler to open the menu
                isEasyMode={isEasyMode}
            />
            
            {/* 1. Date/Time Area - Blinks on Step 0 */}
            <div 
                style={{
                    padding: '30px', 
                    marginTop: '20px',
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
                    aria-label="Transport Question" 
                    style={{fontSize: isEasyMode ? '60px' : '40px', display: 'block', margin: '0 0 10px 0'}}
                >
                    🚗❓
                </span>
                <p style={{fontSize: isEasyMode ? '20px' : '16px', fontWeight: 'bold', margin: '0 0 15px 0', color: '#555'}}>
                    (Tap YES or NO)
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                    <FlowButton label="Yes" emoji="✅" isBlinking={step === 1} isEasyMode={isEasyMode} onClick={() => { setNeedsTransport(true); setStep(2); }} primaryColor="green"/>
                    <FlowButton label="No" emoji="❌" isBlinking={step === 1} isEasyMode={isEasyMode} onClick={() => { setNeedsTransport(false); sendNoTransportData(); }} primaryColor="red"/>
                </div>
            </div>
            
            {/* 3. Choose Needs - Blinks on Step 2 */}
            {step >= 2 && needsTransport && (
                <div style={{...getBlinkingStyle(2), padding: '20px', borderRadius: '15px'}}>
                    <h3 style={{fontSize: isEasyMode ? '32px' : '20px', margin: '0 0 15px 0', color: '#555'}}>
                        Select your need:
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
                                onClick={() => handleNeedSelection(option.key)} // Use new handler
                                primaryColor={option.key === 'other' ? 'purple' : '#1A73E8'}
                            />
                        ))}
                    </div>

                    {/* Display recorded text if 'other' is confirmed */}
                    {transportNeed === 'other' && customNeedText && (
                        <div style={{marginTop: '15px', padding: '10px', border: '1px dashed green', borderRadius: '5px'}}>
                             <p style={{fontSize: isEasyMode ? '20px' : '14px', margin: 0}}>
                                **Confirmed Need:** {customNeedText}
                             </p>
                        </div>
                    )}
                    
                    {transportNeed && (
                        <button
                            onClick={sendTransportData}
                            style={{ padding: '15px 40px', fontSize: isEasyMode ? '30px' : '18px', backgroundColor: 'green', color: 'white', border: 'none', borderRadius: '10px', marginTop: '20px', fontWeight: 'bold'}}
                        >
                            Confirm & Book ✅
                        </button>
                    )}
                </div>
            )}
            
            {/* 4. Final State */}
            {step === 3 && (
                <div style={{ marginTop: '20px', color: 'green', fontWeight: 'bold', fontSize: isEasyMode ? '48px' : '24px' }}>
                    ✅ {needsTransport ? 'Transport booked! Redirecting...' : 'Appointment Confirmed! Redirecting...'}
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