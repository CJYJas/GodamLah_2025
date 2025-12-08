// /frontend-react/src/components/OtherNeedInput.js

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next'; 
import HeaderBar from './HeaderBar';

function OtherNeedInput({ isEasyMode, onConfirmNeed, onCancel }) {
    const { t } = useTranslation(); 
    
    const [isRecording, setIsRecording] = useState(false);
    const [transcribedText, setTranscribedText] = useState('');
    
    // Initial status message from translations
    const [statusMessage, setStatusMessage] = useState(t('unique_needs.tap_to_speak_prompt')); 

    // Mock Transcription Data
    // NOTE: This sentence will appear when the user clicks 'Stop'
    const MOCK_TRANSCRIPTION = "I require space for my oxygen tank and a helper.";
    
    // --- Step 1 & 2: Start/Stop Recording Toggle ---
    const handleRecordToggle = () => {
        if (!isRecording) {
            // --- START RECORDING ACTION (Tapping 1st time) ---
            setIsRecording(true);
            setTranscribedText('');
            
            // Set status to listening
            setStatusMessage(t('unique_needs.listening_prompt'));
            console.log("Audio: 'Please state your requirement clearly.'");

        } else {
            // --- STOP RECORDING ACTION (Tapping 2nd time) ---
            
            // Immediately stop recording state
            setIsRecording(false);
            
            // Show the mock result instantly
            setTranscribedText(MOCK_TRANSCRIPTION);
            
            // Set status to ready
            setStatusMessage(t('unique_needs.transcription_ready_prompt'));
            console.log(`Mock Transcription Ready: ${MOCK_TRANSCRIPTION}`);
        }
    };

    // --- Step 3: Confirmation ---
    const handleConfirm = () => {
        if (transcribedText) {
            // Call the function passed from the parent (AppointmentFlow) to return the data
            onConfirmNeed(transcribedText);
            console.log("Confirmed and sending text to backend:", transcribedText);
        } else {
            setStatusMessage(t('unique_needs.record_first_error'));
        }
    };

    // --- Step 4: Retry/Cancel ---
    const handleRetry = () => {
        setTranscribedText('');
        setStatusMessage(t('unique_needs.tap_to_speak_prompt'));
        setIsRecording(false);
    };

    const micButtonColor = isRecording ? 'red' : (transcribedText ? 'green' : '#1A73E8');
    // Change emoji and label based on state for better clarity
    const micEmoji = isRecording ? '🛑' : '🎙️';
    const micLabel = isRecording ? t('general.stop_speaking') : t('general.start_speaking');


    return (
        <div style={{ padding: '0 20px 20px 20px', textAlign: 'center' }}>
            <HeaderBar title={t('header.title_unique_needs')} onBackClick={onCancel} isEasyMode={isEasyMode} />

            <h3 style={{ fontSize: isEasyMode ? '32px' : '20px', margin: '20px 0 10px 0', color: '#333' }}>
                {t('unique_needs.main_prompt')}
            </h3>

            {/* Status Message */}
            <p style={{ 
                fontSize: isEasyMode ? '24px' : '16px', 
                fontWeight: 'bold', 
                color: isRecording ? 'red' : (transcribedText ? 'green' : '#1A73E8')
            }}>
                {statusMessage}
            </p>

            {/* 1. Microphone Button (Start/Stop Toggle) */}
            <button 
                onClick={handleRecordToggle}
                disabled={transcribedText && !isRecording} // Disable if text is ready and not recording
                style={{
                    padding: '30px', 
                    borderRadius: '50%',
                    backgroundColor: micButtonColor,
                    color: 'white',
                    border: 'none',
                    margin: '20px 0',
                    boxShadow: isRecording ? '0 0 40px rgba(255, 0, 0, 0.8)' : '0 4px 10px rgba(0,0,0,0.2)',
                    animation: isRecording ? 'pulse-record 1s infinite' : 'none',
                    cursor: 'pointer',
                    fontSize: isEasyMode ? '80px' : '50px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: isEasyMode ? '150px' : '100px',
                    height: isEasyMode ? '150px' : '100px',
                    margin: '20px auto 10px auto'
                }}
            >
                <span style={{ fontSize: isEasyMode ? '60px' : '40px' }}>{micEmoji}</span>
                {/* Optional: Add label below mic for clarity in mocking */}
                <span style={{ fontSize: isEasyMode ? '14px' : '10px', marginTop: '5px' }}>
                    {micLabel}
                </span>
            </button>
            
            {/* 2. Transcribed Text Display */}
            {transcribedText && (
                <div style={{
                    border: '2px solid green',
                    padding: '15px',
                    borderRadius: '10px',
                    backgroundColor: '#E8FBE8',
                    marginTop: '20px'
                }}>
                    <p style={{fontSize: isEasyMode ? '28px' : '18px', fontWeight: 'bold', margin: '0 0 5px 0'}}>
                        {t('unique_needs.we_heard_label')}:
                    </p>
                    <p style={{fontSize: isEasyMode ? '22px' : '16px', margin: 0, fontStyle: 'italic'}}>
                        "{transcribedText}"
                    </p>
                </div>
            )}

            {/* 3. Action Buttons */}
            <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'space-around' }}>
                
                <button 
                    onClick={handleRetry}
                    disabled={isRecording}
                    style={{ padding: '15px 30px', fontSize: isEasyMode ? '24px' : '16px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '8px' }}
                >
                    <span role="img" aria-label={t('general.retry_aria')}>🔄</span> {t('general.retry')}
                </button>
                
                <button 
                    onClick={handleConfirm}
                    disabled={!transcribedText || isRecording}
                    style={{ padding: '15px 30px', fontSize: isEasyMode ? '24px' : '16px', backgroundColor: 'green', color: 'white', border: 'none', borderRadius: '8px' }}
                >
                    <span role="img" aria-label={t('general.confirm_aria')}>✅</span> {t('general.confirm')}
                </button>
            </div>
            
             <style jsx>{`
                @keyframes pulse-record {
                    0% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.05); opacity: 0.9; }
                    100% { transform: scale(1); opacity: 1; }
                }
            `}</style>
        </div>
    );
}

export default OtherNeedInput;