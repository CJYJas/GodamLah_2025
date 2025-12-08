import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Button, Card, CircularProgress } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import PhoneIcon from '@mui/icons-material/Phone';
import { useNavigate } from 'react-router-dom';

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
        <Container maxWidth="sm" sx={{ mt: 10, textAlign: 'center' }}>
            <Card sx={{ p: 5, border: '3px solid red', boxShadow: 10 }}>
                <WarningIcon sx={{ fontSize: 80, color: 'red', mb: 2 }} />

                <Typography variant="h4" color="error" fontWeight="bold" gutterBottom>
                    EMERGENCY MODE
                </Typography>

                {!calling ? (
                    <>
                        <Typography variant="h6" sx={{ mb: 3 }}>
                            Calling 999 in <b>{seconds}</b> seconds...
                        </Typography>

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Button
                                variant="contained"
                                color="error"
                                size="large"
                                startIcon={<PhoneIcon />}
                                onClick={handleCall}
                            >
                                Call Now
                            </Button>

                            <Button
                                variant="outlined"
                                color="inherit"
                                size="large"
                                onClick={handleCancel}
                            >
                                Cancel
                            </Button>
                        </Box>
                    </>
                ) : (
                    <Box sx={{ mt: 2 }}>
                        <CircularProgress color="error" />
                        <Typography variant="h6" sx={{ mt: 2 }}>
                            Dialing Emergency Services...
                        </Typography>
                    </Box>
                )}
            </Card>
        </Container>
    );
};

export default Emergency;