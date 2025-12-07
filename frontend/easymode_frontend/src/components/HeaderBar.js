// /frontend-react/src/components/HeaderBar.js (i18n Enabled)

import React from 'react';
import { useTranslation } from 'react-i18next'; // 1. Import useTranslation

const HeaderBar = ({ title, onBackClick, onMenuClick, isEasyMode }) => {
    // 2. Initialize translation hook
    const { t } = useTranslation();
    
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 10px',
            backgroundColor: '#f8f9fa', 
            borderBottom: '1px solid #e0e0e0',
            position: 'relative',
            position: 'sticky',
            top: 0,
            zIndex: 5,
        }}>
            {/* Placeholder/Back Button Group (Left) */}
            <div style={{ width: '30px', flexShrink: 0, visibility: onBackClick ? 'visible' : 'hidden' }}>
                {onBackClick && (
                    <button
                        onClick={onBackClick}
                        style={{
                            padding: '3px',
                            backgroundColor: 'transparent',
                            border: 'none',
                            borderRadius: '50%',
                            cursor: 'pointer',
                            fontSize: isEasyMode ? '30px' : '20px', 
                            color: '#333',
                        }}
                        onMouseOver={e => e.currentTarget.style.backgroundColor = '#ddd'}
                        onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                        {/* 3. Translate ARIA label for the Back button */}
                        <span role="img" aria-label={t('general.back')}>◀️</span>
                    </button>
                )}
            </div>
            
            {/* Title (Center) - Translated by parent component (title prop) */}
            <h2 style={{
                fontSize: isEasyMode ? '34px' : '24px',
                margin: '0',
                color: '#333',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                flexGrow: 1, 
                textAlign: 'center',
            }}>
                {title}
            </h2>
            
            {/* Placeholder/Menu Icon Group (Right) */}
            <div style={{ width: '30px', flexShrink: 0, visibility: onMenuClick ? 'visible' : 'hidden' }}>
                {onMenuClick && (
                    <button
                        onClick={onMenuClick}
                        style={{
                            padding: '3px',
                            backgroundColor: 'transparent',
                            border: 'none',
                            borderRadius: '50%',
                            cursor: 'pointer',
                            fontSize: isEasyMode ? '36px' : '28px',
                            color: '#333',
                        }}
                        onMouseOver={e => e.currentTarget.style.color = '#1A73E8'}
                        onMouseOut={e => e.currentTarget.style.color = '#333'}
                    >
                        {/* 4. Translate ARIA label for the Menu button */}
                        <span role="img" aria-label={t('general.menu')}>☰</span>
                    </button>
                )}
            </div>
        </div>
    );
};

export default HeaderBar;