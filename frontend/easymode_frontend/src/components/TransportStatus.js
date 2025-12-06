// /frontend-react/src/components/TransportStatus.js (FINALIZED)

import React, { useState, useEffect } from 'react';
import HeaderBar from './HeaderBar';

// --- LOCAL MOCK DATA (remains the same) ---
const mockDriverInfo = {
    name: 'Sarah K.',
    carType: 'Blue Minivan',
    carColor: 'Blue',
    licensePlate: 'ABC 1234',
};

// Mock user's specific need (This would normally come from AppointmentFlow component state)
const mockTransportNeed = 'wheelchair'; 

const NEED_EMOJIS = {
    wheelchair: { emoji: '♿', label: 'Wheelchair Access' },
    bedridden: { emoji: '🛏️', label: 'Stretcher Required' },
    slow: { emoji: '🚶', label: 'Slow Walking' },
};

// <<< NOTE: onMenuClick PROP ADDED TO FUNCTION SIGNATURE >>>
function TransportStatus({ isEasyMode, goToMedicalDashboard, goToAppointmentFlow, onMenuClick }) {
    // We now just use the local mock data directly, no need for useState/useEffect to fetch.
    const driverInfo = mockDriverInfo; 

    if (!driverInfo) {
        return <h2 style={{fontSize: isEasyMode ? '48px' : '24px', textAlign: 'center'}}>Loading Transport Info...</h2>;
    }

    const currentNeed = NEED_EMOJIS[mockTransportNeed] || { emoji: '❓', label: 'Unknown Need' };

    const CardStyle = {
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '10px',
        margin: '20px 0',
        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
        borderLeft: '5px solid #1A73E8', 
    };

    return (
        <div style={{ padding: '0 20px 20px 20px', textAlign: 'center' }}>
            
            {/* <<< FIX: PASS onMenuClick PROP TO HEADERBAR >>> */}
            <HeaderBar 
                title="Ride Status" 
                onBackClick={goToMedicalDashboard} 
                onMenuClick={onMenuClick} // Passes the function to display the ☰ icon
                isEasyMode={isEasyMode}
            />
            
            {/* 1. Transport Needs Card */}
            <div style={{...CardStyle, borderLeft: '5px solid orange', marginTop: '20px'}}>
                <p style={{fontSize: isEasyMode ? '32px' : '20px', fontWeight: 'bold', margin: '0 0 10px 0', color: '#555'}}>
                    Your Booked Need:
                </p>
                <span role="img" aria-label={currentNeed.label} style={{fontSize: isEasyMode ? '90px' : '50px', display: 'block'}}>
                    {currentNeed.emoji}
                </span>
                <p style={{fontSize: isEasyMode ? '28px' : '18px', margin: '5px 0', fontWeight: 'bold', color: 'orange'}}>
                    {currentNeed.label}
                </p>
                <button 
                    onClick={goToAppointmentFlow}
                    style={{ padding: '10px 20px', fontSize: isEasyMode ? '24px' : '16px', backgroundColor: 'orange', color: 'white', border: 'none', borderRadius: '8px', marginTop: '10px', fontWeight: 'bold' }}
                >
                    <span role="img" aria-label="Edit">🔄</span> Change Need
                </button>
            </div>
            
            {/* 2. Driver Info Card */}
            <div style={{...CardStyle, borderLeft: '5px solid #4CAF50'}}> 
                <h3 style={{fontSize: isEasyMode ? '32px' : '24px', margin: '0 0 20px 0', color: '#4CAF50'}}>Driver Assigned</h3>

                <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                    
                    {/* Driver Details */}
                    <div style={{ textAlign: 'left', fontSize: isEasyMode ? '26px' : '16px' }}>
                        <p style={{margin: '5px 0'}}>Name: **{driverInfo.name}**</p>
                        <p style={{margin: '5px 0'}}>Type: **{driverInfo.carType}**</p>
                        <p style={{margin: '5px 0'}}>Color: **{driverInfo.carColor}**</p>
                        <p style={{margin: '5px 0'}}>Plate: **{driverInfo.licensePlate}**</p>
                    </div>

                    {/* Driver Photo/Icon */}
                    <span role="img" aria-label="Driver" style={{fontSize: isEasyMode ? '100px' : '50px'}}>🧑‍✈️</span>
                </div>
            </div>

             {/* 3. Back Button (bottom action) */}
             <button 
                onClick={goToMedicalDashboard} 
                style={{ 
                    marginTop: '30px', 
                    padding: '15px 40px', 
                    fontSize: isEasyMode ? '30px' : '18px',
                    backgroundColor: '#333',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    fontWeight: 'bold'
                }}
            >
                <span role="img" aria-label="Back">⬅️</span> Back to Menu
            </button>
        </div>
    );
}

export default TransportStatus;