// /frontend-react/src/components/MedicineReminder.js (FINAL CLEANUP)

import React, { useState } from 'react';
import HeaderBar from './HeaderBar';

// --- LOCAL MOCK DATA (Remains the same) ---
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

// <<< NOTE: onMenuClick PROP ADDED TO FUNCTION SIGNATURE >>>
function MedicineReminder({ isEasyMode, goToPage, onMenuClick }) { 
    const [isDeliveryConfirmed, setIsDeliveryConfirmed] = useState(false);
    const [isDeliveryNeeded, setIsDeliveryNeeded] = useState(null); 

    const medicine = mockMedicineData;

    // --- Daily Reminder Logic ---
    const handleTaken = () => {
        console.log("Medicine Taken confirmed!");
        alert(`Confirmed! Next pill due tomorrow morning.`);
    };

    // --- Refill Logic Handlers (remains the same) ---
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

    // Style for the main daily reminder button (Time to take now)
    const reminderButtonStyle = {
        padding: '30px 40px', // Increased horizontal padding
        backgroundColor: '#4CAF50', // Green for Go/Action
        color: 'white',
        fontSize: isEasyMode ? '36px' : '24px',
        fontWeight: '900', // Extra bold
        borderRadius: '15px',
        width: '90%', // Wider button for easier tapping
        maxWidth: '350px', 
        display: 'inline-block',
        border: 'none',
        cursor: 'pointer',
        boxShadow: '0 8px 20px rgba(0, 70, 0, 0.4)', // Stronger shadow
        animation: 'pulse-take 1.5s infinite',
        margin: '25px 0', // Increased vertical spacing
    };

    const actionButtonStyle = {
        padding: '15px 30px',
        fontSize: isEasyMode ? '28px' : '18px',
        borderRadius: '8px',
        border: '2px solid #ccc', // Added a subtle border
        fontWeight: 'bold',
        cursor: 'pointer',
        margin: '15px 10px', // Increased margin around buttons
    };

    return (
        <div style={{ padding: '0 20px 20px 20px', textAlign: 'center' }}>
            {/* <<< INTEGRATED HEADER BAR WITH SIDE MENU >>> */}
            <HeaderBar 
                title="Medicine" // Clean title
                onBackClick={() => goToPage('medical-dashboard')} 
                onMenuClick={onMenuClick} // Pass the handler to open the menu
                isEasyMode={isEasyMode} 
            />

            <h2 style={{ fontSize: isEasyMode ? '40px' : '30px', margin: '20px 0 10px 0', color: '#1A73E8' }}>
                Daily Reminder
            </h2>

            {/* 1. Daily Reminder Action */}
            <button 
                onClick={handleTaken}
                style={reminderButtonStyle}
            >
                <span role="img" aria-label="Pill" style={{fontSize: isEasyMode ? '60px' : '40px', display: 'block', marginBottom: '10px'}}>💊</span>
                TAKE YOUR PILL NOW
            </button>

            <p style={{ 
                fontSize: isEasyMode ? '28px' : '18px', // Increased font size for pill name
                color: '#555', 
                marginTop: '15px',
                marginBottom: '40px', // Extra spacing before the next section
                fontWeight: 'bold'
            }}>
                {medicine.medicineName} ({medicine.dosage})
            </p>

            {/* 2. Refill Warning Section (Cleaner Look) */}
            {medicine.isRefillLow && !isDeliveryConfirmed && (
                <div style={{
                    marginTop: '30px',
                    padding: '25px', // Increased internal padding
                    border: '4px solid darkred', // Stronger red border
                    borderRadius: '20px', // More rounded corners
                    backgroundColor: '#FFDDDD', 
                    boxShadow: '0 0 15px rgba(200, 0, 0, 0.3)',
                    animation: 'alert-pulse 1s infinite'
                }}>
                    <h3 style={{ fontSize: isEasyMode ? '36px' : '24px', margin: '0 0 20px 0', color: 'darkred' }}>
                        ⚠️ MEDICINE LOW! ⚠️
                    </h3>
                    <p style={{ fontSize: isEasyMode ? '24px' : '18px', margin: '15px 0' }}>
                        Running out in **{medicine.pillsRemaining} days**.
                    </p>

                    {/* Refill Decision Prompt */}
                    {isDeliveryNeeded === null ? (
                        <div>
                            <p style={{ fontSize: isEasyMode ? '28px' : '20px', fontWeight: 'bold', margin: '20px 0 10px 0' }}>
                                Need delivery to your house?
                            </p>
                            <button 
                                onClick={() => handleRefillDecision(true)} 
                                style={{...actionButtonStyle, backgroundColor: 'blue', color: 'white'}}
                            >
                                YES, DELIVER 🚚
                            </button>
                            <button 
                                onClick={() => handleRefillDecision(false)} 
                                style={{...actionButtonStyle, backgroundColor: '#ccc'}}
                            >
                                NO, I'LL GET IT 🚶
                            </button>
                        </div>
                    ) : (
                        // ... (Confirmation message for No Delivery remains the same)
                         !isDeliveryNeeded && (
                            <p style={{ fontSize: isEasyMode ? '24px' : '16px', color: 'darkred', fontWeight: 'bold' }}>
                                Okay, we will remind you daily to pick up your refill!
                            </p>
                        )
                    )}
                </div>
            )}

            {/* 3. Delivery Confirmation Status (Cleaner Look) */}
            {isDeliveryConfirmed && (
                 <div style={{
                    marginTop: '30px',
                    padding: '25px',
                    border: '4px solid green',
                    borderRadius: '20px',
                    backgroundColor: '#E6FBE6',
                }}>
                    <h3 style={{ fontSize: isEasyMode ? '36px' : '24px', margin: '0 0 15px 0', color: 'green' }}>
                        ✅ Delivery Confirmed!
                    </h3>
                    <p style={{ fontSize: isEasyMode ? '24px' : '18px', margin: '5px 0' }}>
                        Courier: **{medicine.courier.name}**
                    </p>
                    <p style={{ fontSize: isEasyMode ? '24px' : '18px', margin: '5px 0' }}>
                        ETA: **{medicine.courier.eta}**
                    </p>
                    <span role="img" style={{fontSize: isEasyMode ? '50px' : '30px'}}>📦</span>
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