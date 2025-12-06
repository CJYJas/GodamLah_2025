// /frontend-react/src/components/SideMenu.js (FINALIZED & CORRECTED NAVIGATION)

import React from 'react';

const MenuItem = ({ name, emoji, onClick, isEasyMode }) => (
    <div
        onClick={onClick}
        style={{
            display: 'flex',
            alignItems: 'center',
            padding: '25px 20px', 
            borderBottom: '1px solid #ddd', 
            cursor: 'pointer',
            backgroundColor: 'white',
            transition: 'background-color 0.15s',
        }}
        onMouseOver={e => e.currentTarget.style.backgroundColor = '#E8F0FE'} 
        onMouseOut={e => e.currentTarget.style.backgroundColor = 'white'}
    >
        <span role="img" aria-label={name} style={{
            fontSize: isEasyMode ? '48px' : '32px', 
            marginRight: '20px', 
            flexShrink: 0,
        }}>{emoji}</span>
        
        <span style={{
            fontSize: isEasyMode ? '30px' : '20px', 
            fontWeight: '900', 
            color: '#1A73E8', 
        }}>{name}</span>
    </div>
);

function SideMenu({ isEasyMode, isOpen, onClose, goToPage }) {

    if (!isOpen) {
        return null; 
    }
    
    // Handler to block clicks inside the menu from closing the backdrop
    const handleModalClick = (e) => {
        e.stopPropagation(); 
    };
    
    // --- CORRECTED HANDLERS ---
    const handleLogout = () => {
        console.log("Action: Logging out...");
        onClose();
        // Redirect to dashboard (login screen mock)
        goToPage('dashboard'); 
    };

    const handleProfile = () => {
        console.log("Action: Viewing Profile...");
        onClose();
        // Navigate to the new ProfilePage component
        goToPage('profile'); 
    };

    const handleLanguage = () => {
        console.log("Action: Changing Language...");
        onClose();
        // Navigate to the new LanguagePage component
        goToPage('language'); 
    };
    // ----------------------------

    return (
        <div 
            onClick={handleModalClick} // Block clicks from bubbling up to close the modal
            style={{
                backgroundColor: '#fff',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)', 
                zIndex: 100,
                width: '90%', 
                maxWidth: '350px', 
                borderRadius: '15px', 
                position: 'relative', 
                overflowY: 'auto',
                maxHeight: '80%', 
            }}
        >
            {/* Header/Close Button (Flat, Clean Look) */}
            <div style={{ 
                padding: '20px 25px', 
                borderBottom: '2px solid #007bff', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                backgroundColor: '#1A73E8', 
                color: 'white',
                borderTopLeftRadius: '15px', 
                borderTopRightRadius: '15px',
            }}>
                <h3 style={{ margin: 0, fontSize: isEasyMode ? '36px' : '24px', fontWeight: 'bold' }}>Menu</h3>
                <button 
                    onClick={onClose} 
                    style={{ 
                        background: 'none', 
                        border: 'none', 
                        color: 'white', 
                        fontSize: isEasyMode ? '36px' : '30px', 
                        cursor: 'pointer' 
                    }}
                >
                    &times;
                </button>
            </div>

            {/* Menu Items */}
            <MenuItem name="Profile" emoji="👤" onClick={handleProfile} isEasyMode={isEasyMode}/>
            <MenuItem name="Language" emoji="🗣️" onClick={handleLanguage} isEasyMode={isEasyMode}/>
            <MenuItem name="Logout" emoji="🚪" onClick={handleLogout} isEasyMode={isEasyMode}/>
        </div>
    );
}

export default SideMenu;