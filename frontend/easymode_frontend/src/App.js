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
import MedicalHistory from './components/MedicalHistory'; 
import MedicationHistoryPage from './components/MedicationHistoryPage'; 
import HospitalizedHistoryPage from './components/Hospitalised_DetailsPage';
import VaccinationHistoryPage from './components/Vaccination_DetailsPage';


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
                        appointment: { date: 'Dec 10', time: '10:00 AM' }, // Mock
                        profile: userData.profile,
                        emergency: userData.emergency,
                        medicine: userData.medicine,
                        transport_need: userData.transport_need
                    });
                }
            } catch (error) {
                console.error("Failed to fetch data:", error);
            }
        };
        fetchAppointmentData();
    }, []);

    // --- Handlers for updating local data ---
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

    // --- PAGE ROUTING ---
    const renderPage = () => {
        switch(currentPage) {
            case 'dashboard':
                return (
                    <Dashboard
                        isEasyMode={isEasyMode}
                        goToMedical={() => setCurrentPage('medical-dashboard')}
                        goToEmergencyInfo={() => setCurrentPage('emergency-info')}
                        goToHistory={() => setCurrentPage('medical-history')}
                        onMenuClick={() => setIsMenuOpen(true)}
                        goToPage={setCurrentPage}
                    />
                );

            case 'medical-dashboard':
                return (
                    <MedicalDashboard
                        isEasyMode={isEasyMode}
                        goToPage={setCurrentPage}
                        onMenuClick={() => setIsMenuOpen(true)}
                    />
                );

            case 'medical-history': 
                return (
                    <MedicalHistory
                        isEasyMode={isEasyMode}
                        goToPage={setCurrentPage}
                        onMenuClick={() => setIsMenuOpen(true)}
                    />
                );
            
            case 'history-medication':
                return (
                    <MedicationHistoryPage
                        isEasyMode={isEasyMode}
                        goToPage={setCurrentPage}
                        onMenuClick={() => setIsMenuOpen(true)}
                    />
                );
            case 'history-hospitalized':
                return (
                    <HospitalizedHistoryPage
                        isEasyMode={isEasyMode}
                        goToPage={setCurrentPage}
                        onMenuClick={() => setIsMenuOpen(true)}
                    />
                );
            case 'history-vaccination':
                return (
                    <VaccinationHistoryPage
                        isEasyMode={isEasyMode}
                        goToPage={setCurrentPage}
                        onMenuClick={() => setIsMenuOpen(true)}
                    />
                );

            case 'appointment':
                return (
                    <AppointmentFlow
                        isEasyMode={isEasyMode}
                        appointment={appData.appointment}
                        goToTransportStatus={() => setCurrentPage('transport')}
                        goToMedicalDashboard={() => setCurrentPage('medical-dashboard')}
                        onMenuClick={() => setIsMenuOpen(true)}
                        onTransportBooked={handleUpdateTransport}
                    />
                );

            case 'transport':
                return (
                    <TransportStatus
                        isEasyMode={isEasyMode}
                        goToAppointmentFlow={() => setCurrentPage('appointment')}
                        goToMedicalDashboard={() => setCurrentPage('medical-dashboard')}
                        onMenuClick={() => setIsMenuOpen(true)}
                        onTransportCleared={handleUpdateTransport}
                        transportNeed={appData.transport_need}
                    />
                );

            case 'medicine':
                return (
                    <MedicineReminder
                        isEasyMode={isEasyMode}
                        goToPage={setCurrentPage}
                        onMenuClick={() => setIsMenuOpen(true)}
                        medicineData={appData.medicine}
                    />
                );

            case 'profile':
                return (
                    <ProfilePage
                        isEasyMode={isEasyMode}
                        goToPage={setCurrentPage}
                        onMenuClick={() => setIsMenuOpen(true)}
                        profileData={appData.profile}
                        onContactSaved={handleUpdateContact}
                    />
                );

            case 'language':
                return (
                    <LanguagePage
                        isEasyMode={isEasyMode}
                        goToPage={setCurrentPage}
                        onMenuClick={() => setIsMenuOpen(true)}
                    />
                );

            case 'emergency-info':
                return (
                    <EmergencyInfoPage
                        isEasyMode={isEasyMode}
                        goToPage={setCurrentPage}
                        onMenuClick={() => setIsMenuOpen(true)}
                        emergencyData={appData.emergency}
                    />
                );

            default:
                return null;
        }
    };

    // --- Styling ---
    const scrollbarHiddenStyle = {
        overflowY: 'auto',
        msOverflowStyle: 'none',
        scrollbarWidth: 'none',
    };

    return (
        <Suspense fallback={<div>{t('app.loading_application')}</div>}>
            <div
                style={{
                    // Removed surrounding padding from this outer div
                    backgroundColor: '#f0f0f0',
                    minHeight: '100vh',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                {/* Phone Frame - RETAINS THE BLACK BORDER AND ROUNDED CORNERS */}
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
                        // REMOVED THE backgroundColor: '#000' AND MOVED IT TO THE BORDER
                    }}
                >
                    {/* App Screen - NOW COVERS 100% OF THE INNER SPACE */}
                    <div
                        style={{
                            height: '100%',
                            width: '100%',
                            backgroundColor: '#ffffff',
                            // MATCH borderRadius TO THE FRAME'S INNER CORNER
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

                    {/* Menu Overlay - NEEDS TO BE ABSOLUTELY POSITIONED RELATIVE TO THE PHONE FRAME */}
                    {isMenuOpen && (
                        <div
                            onClick={() => setIsMenuOpen(false)}
                            style={{
                                // This overlay MUST be positioned relative to the parent frame
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                // Give it the same inner rounded corners as the app screen
                                borderRadius: '25px', 
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