import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Typography, TextField, Button, Box, Card, CircularProgress } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios';
import { useLanguage } from '../context/LanguageContext';
import HealthcareHeader from '../components/HealthcareHeader';

const SignUpStep2: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { t } = useLanguage(); // ✅ Get Translations

    const initialData = location.state || {};

    const [fullName, setFullName] = useState(initialData.fullName || '');
    const [icNumber, setIcNumber] = useState(initialData.icNumber || '');
    const [address, setAddress] = useState(initialData.address || '');
    const [loading, setLoading] = useState(false);

    // Helper: convert base64 to Blob
    const dataURLtoBlob = (dataurl: string | null | undefined) => {
        if (!dataurl) return null;
        try {
            const arr = dataurl.split(',');
            const mimeMatch = arr[0].match(/:(.*?);/);
            if (!mimeMatch) return null;

            const mime = mimeMatch[1];
            const bstr = atob(arr[1]);
            let n = bstr.length;
            const u8arr = new Uint8Array(n);
            while (n--) u8arr[n] = bstr.charCodeAt(n);
            return new Blob([u8arr], { type: mime });
        } catch (e) {
            console.error("Error converting image:", e);
            return null;
        }
    };

    const handleSubmit = async () => {
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("full_name", fullName);
            formData.append("ic_number", icNumber);
            formData.append("address", address);

            const frontBlob = dataURLtoBlob(initialData.frontImage);
            if (frontBlob) formData.append("front_image", frontBlob);

            const backBlob = dataURLtoBlob(initialData.backImage);
            if (backBlob) formData.append("back_image", backBlob);

            // Backend call
            await axios.post("http://localhost:8000/signup/confirm", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

        } catch (err) {
            console.error("Backend error:", err);
        } finally {
            setLoading(false);

            // Navigate to next step regardless of backend success/failure
            navigate("/signup-voice", {
                state: {
                    fullName,
                    icNumber,
                    address,
                    // Keep original images in state just in case
                    frontImage: initialData.frontImage,
                    backImage: initialData.backImage
                }
            });
        }
    };

    return (
        <Container 
            maxWidth="xs" 
            sx={{ 
                minHeight: { xs: '100vh', sm: 'calc(100vh - 45px)' },
                display: 'flex',
                flexDirection: 'column',
                py: { xs: 2, sm: 3 },
                px: { xs: 1.5, sm: 2 },
                width: '100%',
                maxWidth: '100%',
                backgroundColor: 'transparent',
                margin: '0 auto',
                boxSizing: 'border-box'
            }}
        >
            <Button 
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate(-1)}
                sx={{ 
                    mb: 2,
                    color: '#B794F6',
                    textTransform: 'none',
                    alignSelf: 'flex-start',
                    '&:hover': {
                        backgroundColor: 'rgba(183, 148, 246, 0.1)',
                    }
                }}
            >
                {t.back}
            </Button>

            <Card sx={{ 
                p: { xs: 2, sm: 2.5 }, 
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
                borderRadius: { xs: 2, sm: 3 },
                backgroundColor: '#fff',
                width: '100%',
                maxWidth: '100%',
                boxSizing: 'border-box'
            }}>
                <Box sx={{ mb: { xs: 2, sm: 2.5 } }}>
                    <HealthcareHeader title={t.confirmTitle} />
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1.5, sm: 2 }, mt: 1.5, width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
                    <TextField
                        label={t.fullName}
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                fontSize: { xs: '0.875rem', sm: '1rem' }
                            },
                            '& .MuiInputLabel-root': {
                                fontSize: { xs: '0.875rem', sm: '1rem' }
                            }
                        }}
                    />

                    <TextField
                        label={t.icLabel}
                        value={icNumber}
                        onChange={(e) => setIcNumber(e.target.value)}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                fontSize: { xs: '0.875rem', sm: '1rem' }
                            },
                            '& .MuiInputLabel-root': {
                                fontSize: { xs: '0.875rem', sm: '1rem' }
                            }
                        }}
                    />

                    <TextField
                        label={t.address}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        fullWidth
                        multiline
                        rows={3}
                        InputLabelProps={{ shrink: true }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                fontSize: { xs: '0.875rem', sm: '1rem' }
                            },
                            '& .MuiInputLabel-root': {
                                fontSize: { xs: '0.875rem', sm: '1rem' }
                            }
                        }}
                    />

                    <Button
                        variant="contained"
                        size="large"
                        onClick={handleSubmit}
                        sx={{ 
                            mt: 2,
                            backgroundColor: '#B794F6',
                            color: '#1a1a1a',
                            fontWeight: 'bold',
                            py: { xs: 1.25, sm: 1.5 },
                            fontSize: { xs: '0.875rem', sm: '1rem' },
                            borderRadius: 2,
                            textTransform: 'none',
                            boxShadow: '0 4px 12px rgba(183, 148, 246, 0.3)',
                            '&:hover': {
                                backgroundColor: '#9F7AEA',
                            },
                            '&:disabled': {
                                backgroundColor: '#E0E0E0',
                            }
                        }}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={20} sx={{ color: '#1a1a1a' }} /> : t.next}
                    </Button>
                </Box>
            </Card>
        </Container>
    );
};

export default SignUpStep2;