// /frontend-react/src/components/TransportStatus.js

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import HeaderBar from './HeaderBar';

// Icons for transport needs (used locally for display)
const transportIcons = {
    'bedridden': '🛏️',
    'wheelchair': '♿',
    'slow': '🚶',
    'general': '👤',
    'other': '❓'
};

function TransportStatus({ isEasyMode, goToAppointmentFlow, goToMedicalDashboard, onMenuClick, onTransportCleared, transportNeed }) {
    const { t } = useTranslation();
    
    const [rideData, setRideData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // --- API INTEGRATION: FETCH BOOKED RIDE/DRIVER DATA ---
    useEffect(() => {
        const fetchRideData = async () => {
            if (!transportNeed) {
                 setIsLoading(false);
                 return;
            }
            try {
                const response = await fetch('http://localhost:5000/api/get_transport');
                const data = await response.json();

                if (data.status === 'booked' && data.ride_data) {
                    setRideData(data.ride_data);
                }
            } catch (error) {
                console.error("Error fetching transport status:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRideData();
    }, [transportNeed]);

    // Function to map the backend key ('wheelchair') to the translated label
    const getTranslatedLabel = (key) => {
        // NOTE: This MUST map the backend key to the i18n key correctly
        const i18nKeyMap = {
            'bedridden': 'transport_needs.bed',
            'wheelchair': 'transport_needs.chair',
            'slow': 'transport_needs.slow',
            'general': 'transport_needs.general',
            'other': 'transport_needs.other',
        };
        const i18nKey = i18nKeyMap[key];
        
        // Return translated label, or the key itself if it's custom text
        return i18nKey ? t(i18nKey) : key;
    };

    // --- API INTEGRATION: CLEAR TRANSPORT NEED (Change Need button) ---
    const handleChangeNeed = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/clear_transport', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });

            if (response.ok) {
                console.log("Transport cleared on backend. Redirecting...");
                onTransportCleared(null); // Clear local state in App.js
                goToAppointmentFlow(); 
            } else {
                throw new Error("Failed to clear transport on backend.");
            }
        } catch (error) {
            console.error("Error clearing transport:", error);
            alert("Failed to change need due to a network error.");
        }
    };


    if (isLoading) {
        return (
            <div style={{ padding: '70px 20px', textAlign: 'center' }}>
                <HeaderBar title={t('header.title_ride_status')} onBackClick={goToMedicalDashboard} onMenuClick={onMenuClick} isEasyMode={isEasyMode} />
                <h2 style={{marginTop: '30px', color: '#1A73E8'}}>{t('general.loading_transport_info')}</h2>
            </div>
        );
    }
    

    const isBooked = transportNeed && rideData;
    const currentNeedLabel = getTranslatedLabel(transportNeed || t('transport.unknown_need'));

    return (
        <div style={{ padding: '0 20px 20px 20px', textAlign: 'center' }}>
            <HeaderBar title={t('header.title_ride_status')} onBackClick={goToMedicalDashboard} onMenuClick={onMenuClick} isEasyMode={isEasyMode} />
            
            <div style={{ marginTop: '70px' }}>
                
                {/* Booked Need Section */}
                <div style={{
                    padding: '20px',
                    borderRadius: '15px',
                    border: '5px solid orange',
                    backgroundColor: '#FFF8E1',
                    marginBottom: '30px',
                    boxShadow: '0 5px 15px rgba(255, 165, 0, 0.2)',
                }}>
                    <h3 style={{ fontSize: isEasyMode ? '34px' : '22px', color: 'orange', margin: '0 0 15px 0'}}>
                        {t('transport.ride_status_header_booked')}
                    </h3>
                    
                    <div style={{ padding: '10px 0'}}>
                        <span role="img" aria-label={currentNeedLabel} style={{ fontSize: isEasyMode ? '60px' : '40px', display: 'block' }}>
                            {transportIcons[transportNeed] || '❓'}
                        </span>
                        
                        <p style={{ fontSize: isEasyMode ? '36px' : '24px', fontWeight: 'bold', color: '#333', margin: '10px 0'}}>
                            {currentNeedLabel}
                        </p>
                        
                        <button 
                            onClick={handleChangeNeed} 
                            style={{
                                padding: '10px 20px', 
                                fontSize: isEasyMode ? '24px' : '16px',
                                backgroundColor: 'orange',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                marginTop: '10px'
                            }}
                        >
                            {t('general.change_need')} 🔄
                        </button>
                    </div>
                </div>

                {/* Driver Assigned Section */}
                {isBooked ? (
                    <div style={{
                        padding: '20px',
                        borderRadius: '15px',
                        border: '5px solid green',
                        backgroundColor: '#E6FBE6',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        boxShadow: '0 5px 15px rgba(0, 128, 0, 0.2)',
                    }}>
                        <div>
                            <h3 style={{ fontSize: isEasyMode ? '34px' : '22px', color: 'green', margin: '0 0 15px 0', textAlign: 'left'}}>
                                {t('transport.driver_assigned_header')}
                            </h3>
                            <p style={{ margin: '5px 0', fontSize: isEasyMode ? '24px' : '16px', textAlign: 'left' }}>
                                {t('transport.driver_name_label')} **{rideData.driver_name}**
                            </p>
                            <p style={{ margin: '5px 0', fontSize: isEasyMode ? '24px' : '16px', textAlign: 'left' }}>
                                {t('transport.driver_type_label')} **{rideData.vehicle_type}**
                            </p>
                            <p style={{ margin: '5px 0', fontSize: isEasyMode ? '24px' : '16px', textAlign: 'left' }}>
                                {t('transport.driver_color_label')} **{rideData.vehicle_color}**
                            </p>
                            <p style={{ margin: '5px 0', fontSize: isEasyMode ? '24px' : '16px', textAlign: 'left' }}>
                                {t('transport.driver_plate_label')} **{rideData.vehicle_plate}**
                            </p>
                        </div>
                        <span role="img" aria-label={t('transport.driver_aria_label')} style={{ fontSize: isEasyMode ? '80px' : '60px' }}>👮</span>
                    </div>
                ) : (
                    <p style={{ fontSize: isEasyMode ? '24px' : '16px', color: '#999', marginTop: '50px' }}>
                        {t('transport.back_to_menu')}
                    </p>
                )}
            </div>
        </div>
    );
}

export default TransportStatus;