import React from 'react';
import { Button } from '@mui/material';
import { useLanguage } from '../context/LanguageContext';

const LanguageToggle: React.FC = () => {
    // Get the values from our context
    const { language, toggleLanguage } = useLanguage();

    return (
        <Button
            variant="outlined"
            onClick={toggleLanguage}
            sx={{ position: 'absolute', top: 16, right: 16 }}
        >
            {/* If current is English, button says 'Bahasa Malaysia' to switch to it */}
            {language === 'en' ? 'Bahasa Malaysia' : 'English'}
        </Button>
    );
};

export default LanguageToggle;