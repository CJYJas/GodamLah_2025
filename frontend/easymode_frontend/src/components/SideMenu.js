// /frontend-react/src/components/SideMenu.js (Font Size Fixed for Long Translations)

import React from 'react';
import { useTranslation } from 'react-i18next';

const MenuItem = ({ name, emoji, onClick, isEasyMode }) => {
    
    // 🌟 FIX: Determine font size dynamically based on name length
    const baseFontSize = isEasyMode ? 30 : 20;
    let labelFontSize = baseFontSize;

    // If the translated name is very long (e.g., > 15 characters), reduce the font size
    if (name && name.length > 15) {
        labelFontSize = isEasyMode ? 24 : 16;
    } else if (name && name.length > 10) {
         labelFontSize = isEasyMode ? 26 : 18;
    }
    
    return (
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
                // 🛑 APPLIED FIX: Use dynamically calculated font size 🛑
                fontSize: `${labelFontSize}px`, 
                fontWeight: '900', 
                color: '#1A73E8', 
                // Ensure text wraps correctly within the space
                wordBreak: 'break-word',
                overflowWrap: 'break-word',
            }}>
                {name}
            </span>
        </div>
    );
};

function SideMenu({ isEasyMode, isOpen, onClose, goToPage }) {
    const { t } = useTranslation();

    if (!isOpen) {
        return null; 
    }
    
    const handleModalClick = (e) => {
        e.stopPropagation(); 
    };
    
    // --- CORRECTED HANDLERS (No Change) ---
    const handleLogout = () => {
        console.log("Action: Logging out...");
        onClose();
        goToPage('dashboard'); 
    };

    const handleProfile = () => {
        console.log("Action: Viewing Profile...");
        onClose();
        goToPage('profile'); 
    };

    const handleLanguage = () => {
        console.log("Action: Changing Language...");
        onClose();
        goToPage('language'); 
    };
    // ----------------------------

    return (
        <div 
            onClick={handleModalClick} 
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
                <h3 style={{ margin: 0, fontSize: isEasyMode ? '36px' : '24px', fontWeight: 'bold' }}>
                    {t('general.menu')}
                </h3>
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

            {/* Menu Items - Translations passed to name prop */}
            <MenuItem 
                name={t('sidemenu.profile')} 
                emoji="👤" 
                onClick={handleProfile} 
                isEasyMode={isEasyMode}
            />
            <MenuItem 
                name={t('sidemenu.language')} 
                emoji="🗣️" 
                onClick={handleLanguage} 
                isEasyMode={isEasyMode}
            />
            <MenuItem 
                name={t('sidemenu.logout')} 
                emoji="🚪" 
                onClick={handleLogout} 
                isEasyMode={isEasyMode}
            />
        </div>
    );
}

export default SideMenu;