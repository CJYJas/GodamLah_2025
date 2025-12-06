// /frontend-react/src/components/HeaderBar.js (FINAL POLISH FOR ALIGNMENT AND TEXT FLOW)

import React from 'react';

const HeaderBar = ({ title, onBackClick, onMenuClick, isEasyMode }) => (
    <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 10px', // Slightly less vertical padding
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
                        padding: '3px', // Minimal padding
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
                    <span role="img" aria-label="Back">◀️</span>
                </button>
            )}
        </div>
        
        {/* Title (Center) */}
        <h2 style={{
            fontSize: isEasyMode ? '34px' : '24px', // Increased size slightly (from 32px to 34px)
            margin: '0', // Remove horizontal margin to use every pixel
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
                        padding: '3px', // Minimal padding
                        backgroundColor: 'transparent',
                        border: 'none',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        fontSize: isEasyMode ? '36px' : '28px', // Increased size
                        color: '#333',
                    }}
                    onMouseOver={e => e.currentTarget.style.color = '#1A73E8'}
                    onMouseOut={e => e.currentTarget.style.color = '#333'}
                >
                    <span role="img" aria-label="Menu">☰</span>
                </button>
            )}
        </div>
    </div>
);

export default HeaderBar;