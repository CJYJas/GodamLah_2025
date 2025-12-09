import React from 'react';
import { Box, Typography } from '@mui/material';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';

interface HealthcareHeaderProps {
    title?: string;
    subtitle?: string;
}

const HealthcareHeader: React.FC<HealthcareHeaderProps> = ({ title, subtitle }) => {
    return (
        <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            mb: { xs: 2, sm: 2.5 },
            width: '100%',
            maxWidth: '100%',
            boxSizing: 'border-box'
        }}>
            {/* Circular Icon */}
            <Box sx={{
                width: { xs: 50, sm: 70 },
                height: { xs: 50, sm: 70 },
                borderRadius: '50%',
                backgroundColor: '#B794F6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: { xs: 1, sm: 1.5 },
                boxShadow: '0 4px 12px rgba(183, 148, 246, 0.3)',
                flexShrink: 0
            }}>
                <LocalHospitalIcon sx={{ fontSize: { xs: 25, sm: 35 }, color: '#fff' }} />
            </Box>
            
            {/* Title */}
            {title && (
                <Typography 
                    variant="h4" 
                    sx={{ 
                        fontWeight: 'bold', 
                        color: '#1a1a1a',
                        textAlign: 'center',
                        mb: subtitle ? 0.5 : 0,
                        fontSize: { xs: '1.25rem', sm: '1.75rem' },
                        px: { xs: 0.5, sm: 0 },
                        wordBreak: 'break-word',
                        width: '100%',
                        maxWidth: '100%'
                    }}
                >
                    {title}
                </Typography>
            )}
            
            {/* Subtitle */}
            {subtitle && (
                <Typography 
                    variant="body1" 
                    sx={{ 
                        color: '#1a1a1a',
                        textAlign: 'center',
                        mt: 0.5,
                        fontSize: { xs: '0.8125rem', sm: '0.9375rem' },
                        px: { xs: 0.5, sm: 0 },
                        wordBreak: 'break-word',
                        width: '100%',
                        maxWidth: '100%'
                    }}
                >
                    {subtitle}
                </Typography>
            )}
        </Box>
    );
};

export default HealthcareHeader;

