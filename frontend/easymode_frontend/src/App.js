import React, { useState, useEffect } from 'react';
// 🌟 NEW IMPORT: Socket.IO client library
import { io } from 'socket.io-client'; 
import Dashboard from './components/Dashboard';
import MedicalDashboard from './components/MedicalDashboard';
import AppointmentFlow from './components/AppointmentFlow';
import TransportStatus from './components/TransportStatus';
import MedicineReminder from './components/MedicineReminder';
import SideMenu from './components/SideMenu';
import ProfilePage from './components/ProfilePage';
import LanguagePage from './components/LanguagePage';
import EmergencyInfoPage from './components/EmergencyInfoPage';
// Mock data
const mockAppointmentData = { date: 'Dec 10', time: '10:00 AM', hasTransportBooked: false };

function App() {
    const [currentPage, setCurrentPage] = useState('dashboard');
    const [isEasyMode] = useState(true);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isListeningMode, setIsListeningMode] = useState(false); 

    // 🌟 ADDED: Socket.IO Connection and Event Listener
    useEffect(() => {
        // Connect to the Flask SocketIO server on port 5000
        const socket = io('http://localhost:5000'); 

        socket.on('connect', () => {
            console.log('✅ Socket.IO connected to Flask on port 5000.');
        });

        // Listen for the 'emergency_alert' event emitted from Flask
        socket.on('emergency_alert', (data) => {
            if (data.status === "HELP_TRIGGER") {
                console.log("🚨 SocketIO received real-time emergency signal!");
                
                // 1. Activate the listening mode/overlay for visual feedback
                setIsListeningMode(true); 
                
                // 2. Wait 5 seconds, then switch the page
                setTimeout(() => {
                    setIsListeningMode(false);
                    setCurrentPage('emergency-info');
                }, 5000);
            }
        });

        socket.on('disconnect', () => console.log("Socket.IO disconnected"));
        
        // Cleanup function to close the connection when the component unmounts
        return () => {
            socket.disconnect();
        };
    }, []); // Run only once on mount

    // Function to handle the state change when the EmergencyMonitor detects the command
    const handleEmergencyTrigger = () => {
        // NOTE: With Socket.IO, this function's logic is primarily handled 
        // by the 'emergency_alert' listener above, which gets the signal 
        // after the POST request is processed by Flask.
        // However, we can use this to immediately trigger the visual listening overlay.
        console.log("App received initial trigger from Monitor (POST sent). Activating visual overlay.");
        setIsListeningMode(true);
    }


    // PAGE ROUTING
    const renderPage = () => {
        // ... (All your existing page rendering logic remains here) ...
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
                    appointment={mockAppointmentData}
                    goToTransportStatus={() => setCurrentPage('transport')}
                    goToMedicalDashboard={() => setCurrentPage('medical-dashboard')}
                    onMenuClick={() => setIsMenuOpen(true)}
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
                />
            );
        }

        if (currentPage === 'medicine') {
            return (
                <MedicineReminder
                    isEasyMode={isEasyMode}
                    goToPage={setCurrentPage}
                    onMenuClick={() => setIsMenuOpen(true)}
                />
            );
        }

        if (currentPage === 'profile') {
            return (
                <ProfilePage
                    isEasyMode={isEasyMode}
                    goToPage={setCurrentPage}
                    onMenuClick={() => setIsMenuOpen(true)}
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
                />
            );
        }

        return null;
    };

    const scrollbarHiddenStyle = {
        overflowY: 'auto',
        msOverflowStyle: 'none',
        scrollbarWidth: 'none',
    };

    return (
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
                {/* Speaker / Notch */}
                <div style={{}}></div>

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
    );
}

export default App;