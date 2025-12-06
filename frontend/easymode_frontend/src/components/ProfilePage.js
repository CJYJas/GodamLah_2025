// /frontend-react/src/components/ProfilePage.js (FINAL CLEAN LIST LAYOUT)

import React, { useState } from 'react';
import HeaderBar from './HeaderBar';

// --- Local Mock Profile Data (remains the same) ---
const mockProfileData = {
    name: "LIM CHIN WEI",
    icNumber: "851020-07-5XXX",
    dateOfBirth: "20 / OCTOBER / 1985",
    address: "NO. 12, JALAN SAGA, KUALA LUMPUR",
    initialEmergencyContact: "CHIN YEE (012-3456789)", 
};

function ProfilePage({ isEasyMode, goToPage, onMenuClick }) {
    const profile = mockProfileData;
    
    const [emergencyContact, setEmergencyContact] = useState(profile.initialEmergencyContact);
    const [showModal, setShowModal] = useState(false);

    const handleSaveContact = (newContact) => {
        setEmergencyContact(newContact); 
        console.log("Profile Updated! New Emergency Contact:", newContact);
        setShowModal(false); 
        alert(`Emergency contact saved as: ${newContact}`);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    // --- InfoCard Component (Clean Native List Style) ---
    const InfoCard = ({ icon, title, value, isEditable = false }) => (
        <div style={{
            padding: '18px 0', // Increased vertical padding for more air
            margin: '0', 
            width: '100%',
            backgroundColor: '#fff',
            borderBottom: '1px solid #e0e0e0',
            textAlign: 'left',
            position: 'relative', 
        }}>
            <div style={{ padding: '0 20px' }}> 
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                    
                    <p style={{ 
                        fontSize: isEasyMode ? '22px' : '15px', 
                        fontWeight: '600', 
                        margin: 0, 
                        color: isEditable ? 'darkorange' : '#6c757d'
                    }}>
                        <span role="img" aria-label={title} style={{marginRight: '10px'}}>{icon}</span>
                        {title.toUpperCase()}
                    </p>

                    {isEditable && (
                        <button
                            onClick={() => setShowModal(true)}
                            style={{
                                padding: '5px 10px',
                                fontSize: isEasyMode ? '20px' : '12px',
                                backgroundColor: '#1A73E8',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                flexShrink: 0,
                            }}
                        >
                            EDIT ✍️
                        </button>
                    )}
                </div>
                
                <p style={{ 
                    fontSize: isEasyMode ? '32px' : '20px', 
                    fontWeight: 'bold',
                    margin: '0', 
                    color: '#333' 
                }}>
                    {value}
                </p>
            </div>
        </div>
    );
    // --- END InfoCard ---

    // --- Edit Contact Modal Component (Remains the same) ---
    const EditContactModal = ({ currentContact, onSave, onClose, isEasyMode }) => {
        const [tempContact, setTempContact] = useState(currentContact);

        const handleSave = () => { onSave(tempContact); };
        
        return (
            <div style={{
                position: 'absolute', 
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.6)', 
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1000,
            }}>
                {/* Modal Content Box */}
                <div style={{
                    backgroundColor: 'white',
                    padding: isEasyMode ? '30px' : '20px',
                    borderRadius: '15px',
                    width: '85%', 
                    maxWidth: '400px',
                    textAlign: 'center',
                    boxShadow: '0 5px 25px rgba(0,0,0,0.4)', 
                }}>
                    <h3 style={{ 
                        fontSize: isEasyMode ? '35px' : '24px', 
                        marginBottom: '25px', 
                        fontWeight: 'bold' 
                    }}>
                        Edit Emergency Contact 🚨
                    </h3>

                    {/* Input Field */}
                    <input
                        type="text"
                        value={tempContact}
                        onChange={(e) => setTempContact(e.target.value)}
                        style={{
                            width: '90%',
                            padding: isEasyMode ? '15px' : '12px',
                            fontSize: isEasyMode ? '30px' : '18px',
                            border: '2px solid #ccc', 
                            borderRadius: '8px',
                            marginBottom: '35px', 
                            textAlign: 'center',
                        }}
                    />

                    {/* Buttons Container */}
                    <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                        
                        {/* Cancel Button */}
                        <button
                            onClick={onClose}
                            style={{
                                padding: isEasyMode ? '18px 28px' : '12px 22px', 
                                fontSize: isEasyMode ? '28px' : '18px',
                                backgroundColor: '#6c757d',
                                color: 'white',
                                border: 'none',
                                borderRadius: '10px',
                                fontWeight: 'bold',
                            }}
                        >
                            CANCEL ❌
                        </button>
                        
                        {/* Save Button */}
                        <button
                            onClick={handleSave}
                            style={{
                                padding: isEasyMode ? '18px 28px' : '12px 22px', 
                                fontSize: isEasyMode ? '28px' : '18px',
                                backgroundColor: 'darkorange', 
                                color: 'white',
                                border: 'none',
                                borderRadius: '10px',
                                fontWeight: 'bold',
                            }}
                        >
                            SAVE ✅
                        </button>
                    </div>
                </div>
            </div>
        );
    };
    // --- END Edit Contact Modal ---


    return (
        <div style={{ padding: '0', textAlign: 'center', position: 'relative' }}>
            <HeaderBar
                title="Profile"
                onBackClick={() => goToPage('dashboard')}
                onMenuClick={onMenuClick}
                isEasyMode={isEasyMode}
            />

            {/* Increased spacing on main heading to breathe */}
            <h2 style={{ fontSize: isEasyMode ? '40px' : '30px', margin: '30px 0 20px 0', color: '#333', padding: '0 20px' }}>
                Personal Details
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                
                {/* Info Cards List (Clean, tight list structure) */}
                <InfoCard icon="👤" title="Name" value={profile.name} isEasyMode={isEasyMode}/>
                <InfoCard icon="🆔" title="IC Number" value={profile.icNumber} isEasyMode={isEasyMode}/>
                <InfoCard icon="🎂" title="Date of Birth" value={profile.dateOfBirth} isEasyMode={isEasyMode}/>
                <InfoCard icon="🏠" title="Address" value={profile.address} isEasyMode={isEasyMode}/>

                {/* Editable Field */}
                <InfoCard 
                    icon="🚨"
                    title="Emergency Contact" 
                    value={emergencyContact} 
                    isEditable={true} 
                    isEasyMode={isEasyMode}
                />

                {/* Render Modal if showModal is true */}
                {showModal && (
                    <EditContactModal
                        currentContact={emergencyContact}
                        onSave={handleSaveContact}
                        onClose={handleCloseModal}
                        isEasyMode={isEasyMode}
                    />
                )}
            </div>
        </div>
    );
}

export default ProfilePage;