// /frontend-react/src/App.js

import React, { useState, useEffect, Suspense } from 'react';
import { useTranslation } from 'react-i18next';

// Component Imports
import Dashboard from './components/Dashboard';
import MedicalDashboard from './components/MedicalDashboard';
import AppointmentFlow from './components/AppointmentFlow';
import TransportStatus from './components/TransportStatus';
import MedicineReminder from './components/MedicineReminder';
import SideMenu from './components/SideMenu';
import ProfilePage from './components/ProfilePage';
import LanguagePage from './components/LanguagePage';
import EmergencyInfoPage from './components/EmergencyInfoPage';

// --- INITIAL MOCK DATA STATE (Will be overwritten by API) ---
const initialDataState = {
    appointment: { date: 'Loading...', time: 'Loading...' },
    profile: {},
    emergency: {},
    medicine: {},
    transport_need: null
};

function App() {
    const { t } = useTranslation();
    const [currentPage, setCurrentPage] = useState('dashboard');
    const [isEasyMode] = useState(true);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [appData, setAppData] = useState(initialDataState);

    // --- API INTEGRATION: FETCH ALL INITIAL DATA ---
    useEffect(() => {
        const fetchAppointmentData = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/get_all_data');
                const result = await response.json();

                if (result.status === 'success') {
                    const userData = result.user_data;
                    setAppData({
                        appointment: { date: 'Dec 10', time: '10:00 AM' }, // Mock appointment date
                        profile: userData.profile,
                        emergency: userData.emergency,
                        medicine: userData.medicine, // Assumed to contain needed mock data
                        transport_need: userData.transport_need
                    });
                }
            } catch (error) {
                console.error("Failed to fetch data from central base:", error);
                // Keep showing initial loading state or error message
            }
        };
        fetchAppointmentData();
    }, []);
    
    const handleUpdateContact = (newContact) => {
        setAppData(prev => ({
            ...prev,
            profile: { ...prev.profile, emergency_contact: newContact },
            emergency: { ...prev.emergency, primaryContact: newContact }
        }));
    };

    const handleUpdateTransport = (newNeed) => {
        setAppData(prev => ({ ...prev, transport_need: newNeed }));
    };

    // PAGE ROUTING
    const renderPage = () => {
        if (currentPage === 'dashboard') {
            return (
                <Dashboard
                    isEasyMode={isEasyMode}
                    goToMedical={() => setCurrentPage('medical-dashboard')}
                    goToEmergencyInfo={() => setCurrentPage('emergency-info')}
                    onMenuClick={() => setIsMenuOpen(true)}
                />
            );
        }

        if (currentPage === 'medical-dashboard') {
            return (
                <MedicalDashboard
                    isEasyMode={isEasyMode}
                    goToPage={setCurrentPage}
                    onMenuClick={() => setIsMenuOpen(true)}
                />
            );
        }

        if (currentPage === 'appointment') {
            return (
                <AppointmentFlow
                    isEasyMode={isEasyMode}
                    appointment={appData.appointment}
                    goToTransportStatus={() => setCurrentPage('transport')}
                    goToMedicalDashboard={() => setCurrentPage('medical-dashboard')}
                    onMenuClick={() => setIsMenuOpen(true)}
                    onTransportBooked={handleUpdateTransport} // Pass handler for transport update
                />
            );
        }

        if (currentPage === 'transport') {
            return (
                <TransportStatus
                    isEasyMode={isEasyMode}
                    goToAppointmentFlow={() => setCurrentPage('appointment')}
                    goToMedicalDashboard={() => setCurrentPage('medical-dashboard')}
                    onMenuClick={() => setIsMenuOpen(true)}
                    onTransportCleared={handleUpdateTransport} // Pass handler to clear transport locally
                    transportNeed={appData.transport_need}
                />
            );
        }

        if (currentPage === 'medicine') {
            return (
                <MedicineReminder
                    isEasyMode={isEasyMode}
                    goToPage={setCurrentPage}
                    onMenuClick={() => setIsMenuOpen(true)}
                    medicineData={appData.medicine}
                />
            );
        }

        if (currentPage === 'profile') {
            return (
                <ProfilePage
                    isEasyMode={isEasyMode}
                    goToPage={setCurrentPage}
                    onMenuClick={() => setIsMenuOpen(true)}
                    profileData={appData.profile}
                    onContactSaved={handleUpdateContact} // Pass handler for local profile update
                />
            );
        }

        if (currentPage === 'language') {
            return (
                <LanguagePage
                    isEasyMode={isEasyMode}
                    goToPage={setCurrentPage}
                    onMenuClick={() => setIsMenuOpen(true)}
                />
            );
        }

        if (currentPage === 'emergency-info') {
            return (
                <EmergencyInfoPage
                    isEasyMode={isEasyMode}
                    goToPage={setCurrentPage}
                    onMenuClick={() => setIsMenuOpen(true)}
                    emergencyData={appData.emergency} // Pass fetched data
                />
            );
        }

        return null;
    };

    // ... (rest of App component styling and structure) ...
    const scrollbarHiddenStyle = {
        overflowY: 'auto',
        msOverflowStyle: 'none',
        scrollbarWidth: 'none',
    };

    return (
        <Suspense fallback={<div>{t('app.loading_application')}</div>}>
            <div
                style={{
                    padding: '20px',
                    backgroundColor: '#f0f0f0',
                    minHeight: '100vh',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >

                {/* Phone Frame */}
                <div
                    style={{
                        maxWidth: '400px',
                        width: '100%',
                        height: '750px',
                        margin: '20px 0',
                        border: '15px solid #333',
                        borderRadius: '40px',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
                        backgroundColor: '#000',
                        position: 'relative',
                        flexShrink: 0,
                    }}
                >
                    {/* Speaker / Notch (empty div) */}
                    <div></div>

                    {/* App Screen */}
                    <div
                        style={{
                            height: '100%',
                            width: '100%',
                            backgroundColor: '#ffffff',
                            borderRadius: '25px',
                            boxSizing: 'border-box',
                            ...scrollbarHiddenStyle,
                            opacity: isMenuOpen ? 0.3 : 1,
                            pointerEvents: isMenuOpen ? 'none' : 'auto',
                            transition: 'opacity 0.3s ease-out',
                        }}
                        className={`App ${isEasyMode ? 'easy-mode-theme' : 'standard-theme'}`}
                    >
                        {renderPage()}
                    </div>

                    {/* Menu Overlay */}
                    {isMenuOpen && (
                        <div
                            onClick={() => setIsMenuOpen(false)}
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                                zIndex: 100,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <SideMenu
                                isEasyMode={isEasyMode}
                                isOpen={isMenuOpen}
                                onClose={() => setIsMenuOpen(false)}
                                goToPage={setCurrentPage}
                            />
                        </div>
                    )}
                </div>
            </div>
        </Suspense>
    );
}

export default App;