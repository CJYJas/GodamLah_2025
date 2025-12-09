// /frontend-react/src/components/EmergencyInfoPage.js (FINALIZED)

import React from 'react';
import { useTranslation } from 'react-i18next';
import HeaderBar from './HeaderBar';

// --- Local Mock Data for Emergency Triage ---
const mockEmergencyData = {
    bloodType: "O POSITIVE",
    allergies: "PENICILLIN, LATEX",
    conditions: "TYPE 2 DIABETES, MILD ASTHMA",
    medications: "METFORMIN (500mg, Daily)",
    primaryContact: "CHIN YEE (012-3456789)",
};

// --- InfoCard Component (Modified to accept actionButton for ProfilePage reuse) ---
const InfoCard = ({ icon, title, value, isEasyMode, actionButton }) => ( // actionButton prop added
    <div style={{
        padding: '20px 0', 
        margin: '0', 
        width: '100%',
        backgroundColor: '#fff',
        borderBottom: '1px solid #e0e0e0', 
        textAlign: 'left',
    }}>
        <div style={{ padding: '0 20px' }}> 
            
            {/* Flex container for Title + Optional Button */}
            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center' 
            }}>
                <p style={{ 
                    fontSize: isEasyMode ? '26px' : '18px', 
                    fontWeight: '600', 
                    margin: '0 0 5px 0', 
                    color: '#DC3545', 
                }}>
                    <span role="img" aria-label={title} style={{marginRight: '12px'}}>{icon}</span>
                    {title.toUpperCase()}
                </p>
                {/* actionButton is provided by ProfilePage (not used here) */}
                {actionButton} 
            </div>
            
            <p style={{ 
                fontSize: isEasyMode ? '36px' : '24px', 
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
    const { t } = useTranslation();
    const data = mockEmergencyData;

    return (
        <div style={{ padding: '0', textAlign: 'center', position: 'relative' }}>
            <HeaderBar
                // 3. Translate the header title
                title={t('header.title_emergency_info')}
                onBackClick={() => goToPage('dashboard')}
                onMenuClick={onMenuClick} 
                isEasyMode={isEasyMode}
            />

            {/* Main Title - Added 70px margin top to clear sticky HeaderBar */}
            <h2 style={{ fontSize: isEasyMode ? '44px' : '32px', margin: '70px 0 30px 0', color: '#DC3545', padding: '0 20px' }}>
                {t('emergency.act_immediately')} 🚨
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                
                {/* Essential Medical Details (HIGH PRIORITY) */}
                <InfoCard 
                    icon="🩸" 
                    title={t('emergency.blood_type_label')} 
                    value={data.bloodType} 
                    isEasyMode={isEasyMode}
                />
                <InfoCard 
                    icon="⚠️" 
                    title={t('emergency.allergies_label')} 
                    value={data.allergies} 
                    isEasyMode={isEasyMode}
                />
                <InfoCard 
                    icon="⚕️" 
                    title={t('emergency.conditions_label')} 
                    value={data.conditions} 
                    isEasyMode={isEasyMode}
                />
                <InfoCard 
                    icon="💊" 
                    title={t('emergency.meds_taken_label')} 
                    value={data.medications} 
                    isEasyMode={isEasyMode}
                />

                {/* Contact Information (Primary only) */}
                <InfoCard 
                    icon="📞" 
                    title={t('emergency.emergency_contact_label')} 
                    value={data.primaryContact} 
                    isEasyMode={isEasyMode}
                    // actionButton is implicitly undefined here, ensuring no button is shown
                />
                
                {/* Note/Disclaimer */}
                <p style={{ fontSize: isEasyMode ? '18px' : '12px', margin: '40px 20px', color: '#6c757d' }}>
                    {t('general.disclaimer_first_responders')}
                </p>
            </div>
        </div>
    );
}

export default EmergencyInfoPage;