// /frontend-react/src/components/OtherNeedInput.js

import React, { useState } from 'react';
import HeaderBar from './HeaderBar';

function OtherNeedInput({ isEasyMode, onConfirmNeed, onCancel }) {
    const [isRecording, setIsRecording] = useState(false);
    const [transcribedText, setTranscribedText] = useState('');
    const [statusMessage, setStatusMessage] = useState('Tap the mic to start speaking.');

    // Mock Transcription Data
    const MOCK_TRANSCRIPTION = "I require space for my oxygen tank and a helper.";
    
    // --- Step 1 & 2: Start Recording and Mock Transcription ---
    const handleRecordToggle = () => {
        if (!isRecording) {
            // Start recording (Visual state change)
            setIsRecording(true);
            setTranscribedText('');
            setStatusMessage('LISTENING... Please state your requirement clearly.');
            console.log("Audio: 'Please state your requirement clearly.'");

            // Mock AI processing delay (3 seconds)
            setTimeout(() => {
                // Stop recording and show result
                setIsRecording(false);
                setTranscribedText(MOCK_TRANSCRIPTION);
                setStatusMessage('Transcription Ready. Confirm or Retry.');
                console.log(`Audio: 'We recorded: ${MOCK_TRANSCRIPTION}. Is this correct?'`);
            }, 3000);

        } else {
            // If user taps mic while recording (manual stop)
            setIsRecording(false);
            setStatusMessage('Recording Stopped. Tap Confirm or Retry.');
        }
    };

    // --- Step 3: Confirmation ---
    const handleConfirm = () => {
        if (transcribedText) {
            // Call the function passed from the parent (AppointmentFlow) to return the data
            onConfirmNeed(transcribedText);
            console.log("Confirmed and sending text to backend:", transcribedText);
        } else {
            setStatusMessage('Please record your need first.');
        }
    };

    // --- Step 4: Retry/Cancel ---
    const handleRetry = () => {
        setTranscribedText('');
        setStatusMessage('Tap the mic to start speaking.');
        setIsRecording(false);
    };

    const micButtonColor = isRecording ? 'red' : (transcribedText ? 'green' : '#1A73E8');
    const micEmoji = isRecording ? '🔴' : '🎙️';


    return (
        <div style={{ padding: '0 20px 20px 20px', textAlign: 'center' }}>
            <HeaderBar title="Unique Needs" onBackClick={onCancel} isEasyMode={isEasyMode} />

            <h3 style={{ fontSize: isEasyMode ? '32px' : '20px', margin: '20px 0 10px 0', color: '#333' }}>
                State Your Need
            </h3>

            {/* Status Message */}
            <p style={{ 
                fontSize: isEasyMode ? '24px' : '16px', 
                fontWeight: 'bold', 
                color: isRecording ? 'red' : (transcribedText ? 'green' : '#1A73E8')
            }}>
                {statusMessage}
            </p>

            {/* 1. Microphone Button (Record/Stop) */}
            <button 
                onClick={handleRecordToggle}
                disabled={isRecording && transcribedText} // Disable if recording and already have text
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
                }}
            >
                {micEmoji}
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
                        We heard:
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
                    <span role="img" aria-label="Retry">🔄</span> Retry
                </button>
                
                <button 
                    onClick={handleConfirm}
                    disabled={!transcribedText || isRecording}
                    style={{ padding: '15px 30px', fontSize: isEasyMode ? '24px' : '16px', backgroundColor: 'green', color: 'white', border: 'none', borderRadius: '8px' }}
                >
                    <span role="img" aria-label="Confirm">✅</span> Confirm
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