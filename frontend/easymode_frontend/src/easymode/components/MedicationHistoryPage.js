// /frontend-react/src/components/MedicationHistoryPage.js

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import HeaderBar from './HeaderBar'; 

// --- MOCK DATA (Defined outside for clarity) ---
const detail = {
    title: "Medications",
    medicationList: [
        { id: 1, name: "Blood Pressure Pill (5mg)", details: "Take one pill once daily, every morning.", lastTaken: "Today, 8:00 AM" },
        { id: 2, name: "Multivitamin", details: "Take one tablet once daily with breakfast.", lastTaken: "Today, 9:00 AM" },
        { id: 3, name: "Aspirin (81mg)", details: "Take one tablet once daily with dinner.", lastTaken: "Yesterday, 7:00 PM" },
    ],
    lastUpdated: "Dec 5, 2025",
    pdfLink: "Link_to_detailed_Medication_History_Report.pdf",
    color: { bg: '#E8F0FE', border: '#1A73E8', emoji: '💊' },
};

const PHONE_MAX_WIDTH = '450px';


// --- Internal Component: MedicationDetailsModal ---
const MedicationDetailsModal = ({ t, isEasyMode, medication, onClose, detail }) => {
    if (!medication) return null;

    const modalStyle = {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        zIndex: 200,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        boxSizing: 'border-box',
    };

    const contentStyle = {
        padding: '30px',
        backgroundColor: '#FFFFFF',
        border: `4px solid ${detail.color.bg}`,
        borderRadius: '20px',
        textAlign: 'center',
        boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
        width: '85%',
        maxHeight: '80vh',
        overflowY: 'auto',
    };

    const titleStyle = {
        fontSize: isEasyMode ? '38px' : '26px',
        color: '#1A73E8',
        margin: '0 0 20px 0',
        fontWeight: 'bold',
    };

    const instructionsStyle = {
        fontSize: isEasyMode ? '32px' : '22px',
        lineHeight: '1.4',
        color: '#333',
        margin: '25px 0 10px 0',
        fontWeight: '900',
    };

    const lastTakenStyle = {
        fontSize: isEasyMode ? '28px' : '18px',
        lineHeight: '1.4',
        color: '#666',
        margin: '0 0 40px 0',
        fontWeight: 'normal',
    };

    const closeButtonStyle = {
        padding: '12px 30px',
        fontSize: isEasyMode ? '28px' : '18px',
        fontWeight: 'bold',
        borderRadius: '10px',
        border: '1px solid #ccc',
        cursor: 'pointer',
        width: '100%',
        backgroundColor: '#e0e0e0',
        color: '#333',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    };

    return (
        <div style={modalStyle}>
            <div style={contentStyle}>
                <h3 style={titleStyle}>{medication.name}</h3>
                <span style={{ fontSize: isEasyMode ? '90px' : '60px', display: 'block', margin: '15px 0' }}>
                    {detail.color.emoji}
                </span>
                <p style={instructionsStyle}>{medication.details}</p>

                {medication.lastTaken && (
                    <p style={lastTakenStyle}>Last taken: {medication.lastTaken}</p>
                )}

                <button onClick={onClose} style={closeButtonStyle}>
                    {t('general.back')}
                </button>
            </div>
        </div>
    );
};


// --- MAIN PAGE ---
function MedicationHistoryPage({ isEasyMode, goToPage, onMenuClick }) {
    const { t } = useTranslation();
    const [selectedMedication, setSelectedMedication] = useState(null);

    const listButtonStyle = {
        padding: '20px',
        margin: '15px 0',
        borderRadius: '10px',
        border: `3px solid ${detail.color.border}`,
        backgroundColor: detail.color.bg,
        textAlign: 'left',
        width: '100%',
        cursor: 'pointer',
        fontSize: isEasyMode ? '32px' : '20px',
        fontWeight: '900',
        color: detail.color.border,
        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    };

    const preciseButtonStyle = {
        padding: '15px 30px',
        fontSize: isEasyMode ? '24px' : '16px',
        fontWeight: 'bold',
        borderRadius: '10px',
        border: 'none',
        cursor: 'pointer',
        marginTop: '10px',
        backgroundColor: '#DC3545',
        color: 'white',
        boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
    };

    const handleViewPrecise = () => {
        alert(`Opening PRECISE REPORT for ${detail.title} \nLink: ${detail.pdfLink}`);
        console.log(`Precise Report Link: ${detail.pdfLink}`);
    };

    return (
        <div
            style={{
                padding: '0 20px 20px 20px',
                maxWidth: PHONE_MAX_WIDTH,
                margin: '0 auto',
                position: 'relative',
            }}
        >
            {/* Modal */}
            <MedicationDetailsModal
                t={t}
                isEasyMode={isEasyMode}
                medication={selectedMedication}
                onClose={() => setSelectedMedication(null)}
                detail={detail}
            />

            <HeaderBar
                title={detail.title}
                onBackClick={() => goToPage('medical-history')}
                onMenuClick={onMenuClick}
                isEasyMode={isEasyMode}
            />

            {/* ------ FIXED ALIGNMENT WRAPPER BELOW HEADER ------ */}
            <div style={{ marginTop: isEasyMode ? '120px' : '90px' }}>
                <h2
                    style={{
                        fontSize: isEasyMode ? '40px' : '30px',
                        margin: '0',
                        color: detail.color.border,
                        textAlign: 'center',
                    }}
                >
                    {t('history_details.simple_summary')}
                </h2>

                <p
                    style={{
                        fontSize: isEasyMode ? '22px' : '16px',
                        textAlign: 'center',
                        marginTop: '10px',
                        marginBottom: '30px',
                        color: '#666',
                    }}
                >
                    {t('history_details.medication_tap_prompt')}
                </p>
            </div>

            {/* --- Medication Buttons --- */}
            <div style={{ maxWidth: '380px', margin: '0 auto' }}>
                {detail.medicationList.map((med) => (
                    <button
                        key={med.id}
                        onClick={() => setSelectedMedication(med)}
                        style={listButtonStyle}
                    >
                        {med.name}
                        <span style={{ fontSize: isEasyMode ? '36px' : '24px' }}>&gt;</span>
                    </button>
                ))}
            </div>

            <p
                style={{
                    fontSize: isEasyMode ? '20px' : '14px',
                    textAlign: 'center',
                    margin: '20px 0 30px 0',
                    color: '#999',
                }}
            >
                {t('history_details.last_updated_label')}: {detail.lastUpdated}
            </p>

            <h3
                style={{
                    fontSize: isEasyMode ? '30px' : '20px',
                    margin: '40px 0 10px 0',
                    textAlign: 'center',
                    color: '#666',
                }}
            >
                {t('history_details.precise_access_prompt')}
            </h3>

            <div style={{ textAlign: 'center' }}>
                <button onClick={handleViewPrecise} style={preciseButtonStyle}>
                    {t('history_details.view_precise_report')}
                </button>

                <p
                    style={{
                        fontSize: isEasyMode ? '18px' : '12px',
                        marginTop: '15px',
                        color: '#999',
                    }}
                >
                    {t('history_details.precise_report_note')}
                </p>
            </div>
        </div>
    );
}

export default MedicationHistoryPage;
