// /frontend-react/src/components/EmergencyInfoPage.js (FINALIZED & CLEANED)

import React from 'react';
import HeaderBar from './HeaderBar';

// --- Local Mock Data for Emergency Triage ---
const mockEmergencyData = {
    bloodType: "O POSITIVE",
    allergies: "PENICILLIN, LATEX",
    conditions: "TYPE 2 DIABETES, MILD ASTHMA",
    medications: "METFORMIN (500mg, Daily)",
    primaryContact: "CHIN YEE (012-3456789)",
    // Primary physician data removed as requested
};

// Reusing the clean InfoCard design concept
const InfoCard = ({ icon, title, value, isEasyMode }) => (
    <div style={{
        padding: '20px 0', // Increased vertical padding for space
        margin: '0', 
        width: '100%',
        backgroundColor: '#fff',
        borderBottom: '1px solid #e0e0e0', // Clean separator
        textAlign: 'left',
    }}>
        <div style={{ padding: '0 20px' }}> 
            
            <p style={{ 
                fontSize: isEasyMode ? '26px' : '18px', // Slightly larger label font
                fontWeight: '600', 
                margin: '0 0 5px 0', 
                color: '#DC3545', // Prominent RED for emergency clarity
            }}>
                <span role="img" aria-label={title} style={{marginRight: '12px'}}>{icon}</span>
                {title.toUpperCase()}
            </p>
            
            <p style={{ 
                fontSize: isEasyMode ? '36px' : '24px', // Larger data font
                fontWeight: 'bold',
                margin: '0', 
                color: '#333' 
            }}>
                {value}
            </p>
        </div>
    </div>
);


function EmergencyInfoPage({ isEasyMode, goToPage, onMenuClick }) {
    const data = mockEmergencyData;

    return (
        <div style={{ padding: '0', textAlign: 'center', position: 'relative' }}>
            <HeaderBar
                title="Emergency Info"
                onBackClick={() => goToPage('dashboard')}
                onMenuClick={onMenuClick} 
                isEasyMode={isEasyMode}
            />

            {/* Main Title - Increased bottom margin for separation */}
            <h2 style={{ fontSize: isEasyMode ? '44px' : '32px', margin: '30px 0 30px 0', color: '#DC3545', padding: '0 20px' }}>
                ACT IMMEDIATELY 🚨
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                
                {/* Essential Medical Details (HIGH PRIORITY) */}
                <InfoCard icon="🩸" title="Blood Type" value={data.bloodType} isEasyMode={isEasyMode}/>
                <InfoCard icon="⚠️" title="Allergies" value={data.allergies} isEasyMode={isEasyMode}/>
                <InfoCard icon="⚕️" title="Conditions" value={data.conditions} isEasyMode={isEasyMode}/>
                <InfoCard icon="💊" title="Meds Taken" value={data.medications} isEasyMode={isEasyMode}/>

                {/* Contact Information (Primary only) */}
                <InfoCard icon="📞" title="Emergency Contact" value={data.primaryContact} isEasyMode={isEasyMode}/>
                
                {/* Note/Disclaimer - Increased top margin */}
                <p style={{ fontSize: isEasyMode ? '18px' : '12px', margin: '40px 20px', color: '#6c757d' }}>
                    **Disclaimer:** This non-sensitive info is displayed for first responders only.
                </p>
            </div>
        </div>
    );
}

export default EmergencyInfoPage;