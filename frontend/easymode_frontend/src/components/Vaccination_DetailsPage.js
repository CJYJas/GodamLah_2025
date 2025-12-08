// /frontend-react/src/components/VaccinationHistoryPage.js

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import HeaderBar from './HeaderBar';

// --- MOCK DATA (Updated to a list structure) ---
const detail = {
    title: "Vaccinations",
    historyList: [
        { id: 1, name: "COVID-19 Booster", date: "Nov 2024", essential: "Latest booster dose administered.", emoji: '💉' },
        { id: 2, name: "Flu Shot", date: "Oct 2025", essential: "Annual influenza shot administered.", emoji: '🦠' },
        { id: 3, name: "Pneumococcal (PCV13)", date: "Mar 2020", essential: "Pneumonia vaccine administered.", emoji: '🛡️' },
    ],
    pdfLink: "Link_to_official_Vaccination_Record.pdf",
    color: { bg: '#E6FBE6', border: '#4CAF50', emoji: '💉' },
};

const PHONE_MAX_WIDTH = '450px';

// --- Modal Component ---
const VaccinationDetailsModal = ({ t, isEasyMode, event, onClose, detail }) => {
    if (!event) return null;

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
        color: detail.color.border,
        margin: '0 0 10px 0',
        fontWeight: 'bold',
    };

    const instructionsStyle = {
        fontSize: isEasyMode ? '32px' : '22px',
        lineHeight: '1.4',
        color: '#333',
        margin: '25px 0 10px 0',
        fontWeight: '900',
    };

    const dateStyle = {
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
                <h3 style={titleStyle}>{event.name}</h3>

                <span style={{ fontSize: isEasyMode ? '90px' : '60px', display: 'block', margin: '15px 0' }}>
                    {event.emoji}
                </span>

                <p style={instructionsStyle}>{event.essential}</p>

                {event.date && <p style={dateStyle}>Date: {event.date}</p>}

                <button onClick={onClose} style={closeButtonStyle}>
                    {t('general.back')}
                </button>
            </div>
        </div>
    );
};

// --- Page Component ---
function VaccinationHistoryPage({ isEasyMode, goToPage, onMenuClick }) {
    const { t } = useTranslation();
    const [selectedEvent, setSelectedEvent] = useState(null);

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
        transition: 'background-color 0.2s',
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
            <VaccinationDetailsModal
                t={t}
                isEasyMode={isEasyMode}
                event={selectedEvent}
                onClose={() => setSelectedEvent(null)}
                detail={detail}
            />

            <HeaderBar
                title={detail.title}
                onBackClick={() => goToPage('medical-history')}
                onMenuClick={onMenuClick}
                isEasyMode={isEasyMode}
            />

            <h2
                style={{
                    fontSize: isEasyMode ? '40px' : '30px',
                    margin: '30px 0 0 0',
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
                Tap any vaccine below to see details and dates.
            </p>

            <div style={{ maxWidth: '380px', margin: '0 auto' }}>
                {detail.historyList.map((event) => (
                    <button
                        key={event.id}
                        onClick={() => setSelectedEvent(event)}
                        style={listButtonStyle}
                    >
                        {event.name} ({event.date})
                        <span style={{ fontSize: isEasyMode ? '36px' : '24px', marginLeft: '10px' }}>
                            &gt;
                        </span>
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
                {t('history_details.last_updated_label')}: {detail.historyList[0].date}
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

export default VaccinationHistoryPage;
