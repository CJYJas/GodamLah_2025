import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Button, Card, CircularProgress } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import PhoneIcon from '@mui/icons-material/Phone';
import { useNavigate } from 'react-router-dom';
import HealthcareHeader from '../components/HealthcareHeader';

const Emergency: React.FC = () => {
    const navigate = useNavigate();
    const [seconds, setSeconds] = useState(5);
    const [calling, setCalling] = useState(false);

    // Auto-countdown effect
    useEffect(() => {
        if (seconds > 0 && !calling) {
            const timer = setTimeout(() => setSeconds(seconds - 1), 1000);
            return () => clearTimeout(timer);
        } else if (seconds === 0 && !calling) {
            handleCall();
        }
    }, [seconds, calling]);

    const handleCall = () => {
        setCalling(true);
        // Simulate calling logic
        setTimeout(() => {
            alert("Calling Emergency Services (999)...");
            window.location.href = "tel:999"; // Actual phone trigger
        }, 1000);
    };

    const handleCancel = () => {
        navigate('/signin');
    };

    return (
        <Container 
            maxWidth="xs" 
            sx={{ 
                minHeight: { xs: '100vh', sm: 'calc(100vh - 45px)' },
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                py: { xs: 2, sm: 3 },
                px: { xs: 1.5, sm: 2 },
                width: '100%',
                maxWidth: '100%',
                backgroundColor: 'transparent',
                margin: '0 auto',
                boxSizing: 'border-box'
            }}
        >
            <Card sx={{ 
                p: { xs: 2, sm: 2.5 }, 
                border: '3px solid #EF4444', 
                boxShadow: '0 8px 24px rgba(239, 68, 68, 0.3)',
                borderRadius: { xs: 2, sm: 3 },
                backgroundColor: '#fff',
                textAlign: 'center',
                width: '100%',
                maxWidth: '100%',
                boxSizing: 'border-box'
            }}>
                <WarningIcon sx={{ fontSize: { xs: 50, sm: 70 }, color: '#EF4444', mb: { xs: 1.5, sm: 2 } }} />

                <Typography variant="h4" sx={{ color: '#EF4444', fontWeight: 'bold', mb: { xs: 1.5, sm: 2 }, fontSize: { xs: '1.25rem', sm: '1.75rem' }, wordBreak: 'break-word' }}>
                    EMERGENCY MODE
                </Typography>

                {!calling ? (
                    <>
                        <Typography variant="h6" sx={{ mb: { xs: 2.5, sm: 3 }, color: '#666', fontSize: { xs: '0.9375rem', sm: '1.125rem' }, wordBreak: 'break-word' }}>
                            Calling 999 in <b style={{ color: '#EF4444' }}>{seconds}</b> seconds...
                        </Typography>

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
                            <Button
                                variant="contained"
                                size="large"
                                startIcon={<PhoneIcon />}
                                onClick={handleCall}
                                sx={{
                                    backgroundColor: '#EF4444',
                                    color: '#fff',
                                    fontWeight: 'bold',
                                    py: { xs: 1.25, sm: 1.5 },
                                    fontSize: { xs: '0.875rem', sm: '1rem' },
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
                                    '&:hover': {
                                        backgroundColor: '#DC2626',
                                    }
                                }}
                            >
                                Call Now
                            </Button>

                            <Button
                                variant="outlined"
                                size="large"
                                onClick={handleCancel}
                                sx={{
                                    borderColor: '#B794F6',
                                    color: '#B794F6',
                                    fontWeight: 'bold',
                                    py: { xs: 1.25, sm: 1.5 },
                                    fontSize: { xs: '0.875rem', sm: '1rem' },
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    borderWidth: 2,
                                    '&:hover': {
                                        borderColor: '#9F7AEA',
                                        backgroundColor: 'rgba(183, 148, 246, 0.1)',
                                        borderWidth: 2,
                                    }
                                }}
                            >
                                Cancel
                            </Button>
                        </Box>
                    </>
                ) : (
                    <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                        <CircularProgress sx={{ color: '#EF4444' }} />
                        <Typography variant="h6" sx={{ color: '#666', fontSize: { xs: '1rem', sm: '1.25rem' }, wordBreak: 'break-word' }}>
                            Dialing Emergency Services...
                        </Typography>
                    </Box>
                )}
            </Card>
        </Container>
    );
};

export default Emergency;