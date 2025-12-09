// pages/UserMode.jsx 

import React, { useState, useEffect, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
// Using useNavigate import just to eliminate a potential runtime warning
import { useNavigate } from 'react-router-dom'; 

// Component Imports - RESTORING original deep relative paths for components
import Dashboard from '../../easymode/components/Dashboard';
import MedicalDashboard from '../../easymode/components/MedicalDashboard';
import AppointmentFlow from '../../easymode/components/AppointmentFlow';
import TransportStatus from '../../easymode/components/TransportStatus';
import MedicineReminder from '../../easymode/components/MedicineReminder';
import SideMenu from '../../easymode/components/SideMenu';
import ProfilePage from '../../easymode/components/ProfilePage';
import LanguagePage from '../../easymode/components/LanguagePage';
import EmergencyInfoPage from '../../easymode/components/EmergencyInfoPage';
import MedicalHistory from '../../easymode/components/MedicalHistory';
import MedicationHistoryPage from '../../easymode/components/MedicationHistoryPage';
import HospitalizedHistoryPage from '../../easymode/components/Hospitalised_DetailsPage';
import VaccinationHistoryPage from '../../easymode/components/Vaccination_DetailsPage';

// --- INITIAL MOCK DATA STATE ---
const initialDataState = {
    appointment: { date: 'Loading...', time: 'Loading...' },
    profile: {},
    emergency: {},
    medicine: {},
    transport_need: null
};

// UserMode is the new component that handles the in-app experience
function UserMode() {
    // const navigate = useNavigate(); // Keep commented out unless needed for navigation from this component
    const { t } = useTranslation();
    // Internal state for navigation within the user mode
    const [currentPage, setCurrentPage] = useState('dashboard');
    const [isEasyMode] = useState(true);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [appData, setAppData] = useState(initialDataState);

    // --- API INTEGRATION: FETCH ALL INITIAL DATA ---
    useEffect(() => {
        // Hardcode the test IC used in your flask_data.py
        const TEST_IC = "990101145678"; 
        
        const fetchAppointmentData = async () => {
            try {
                // ✅ CORRECTED: URL now includes the required IC number
                const response = await fetch(`http://localhost:5000/api/get_all_data/${TEST_IC}`); 
                const result = await response.json();

                if (response.status !== 200) {
                    console.error("API Fetch failed with status:", response.status, "Message:", result.message);
                    return;
                }

                if (result.status === 'success') {
                    const userData = result.user_data;
                    setAppData({
                        appointment: userData.appointment,
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

    // --- PAGE ROUTING (INTERNAL STATE SWITCH) ---
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

    return (
        <Suspense fallback={<div>{t('app.loading_application')}</div>}>
            <div
                style={{
                    height: '100%',
                    width: '100%',
                    position: 'relative', 
                    // ✅ Clickability Fix: Removed opacity and pointerEvents from the main wrapper
                    // to ensure the dashboard is always interactive when the menu is closed.
                }}
                className={`App ${isEasyMode ? 'easy-mode-theme' : 'standard-theme'}`}
            >
                {/* Apply dimming and click blocking to the content only when menu is open */}
                <div
                    style={{
                        opacity: isMenuOpen ? 0.3 : 1,
                        pointerEvents: isMenuOpen ? 'none' : 'auto',
                        transition: 'opacity 0.3s ease-out',
                        height: '100%',
                        width: '100%',
                    }}
                >
                    {renderPage()}
                </div>


                {/* Menu Overlay - Positioned absolutely inside UserMode */}
                {isMenuOpen && (
                    <div
                        // This div handles the click outside (backdrop)
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
                            // ✅ Stop propagation: Prevent clicks on the menu content from closing it
                            onClick={(e) => e.stopPropagation()} 
                        />
                    </div>
                )}
            </div>
        </Suspense>
    );
}

export default UserMode;