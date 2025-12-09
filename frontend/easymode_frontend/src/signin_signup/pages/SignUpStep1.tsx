import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { Button, Container, Typography, Box, CircularProgress, Card, CardMedia } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useLanguage } from '../context/LanguageContext';
import HealthcareHeader from '../components/HealthcareHeader';

const SignUpStep1: React.FC = () => {
    const { t } = useLanguage(); // ✅ Get Translations
    const webcamRef = useRef<Webcam>(null);
    const [frontImg, setFrontImg] = useState<string | null>(null);
    const [backImg, setBackImg] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const capture = (setImg: Function) => {
        const imageSrc = webcamRef.current?.getScreenshot();
        if (imageSrc) setImg(imageSrc);
    };

    const handleRetake = () => {
        setFrontImg(null);
        setBackImg(null);
    };

    const handleNext = () => {
        if (!frontImg || !backImg) return alert(t.captureError); // "Please capture both sides"

        setLoading(true);

        // Simulate backend processing
        setTimeout(() => {
            const mockResult = {
                fullName: "TAN SENG HONG",
                icNumber: "990101-14-5678",
                address: "N277 JALAN PERKASA 1 TAMAN MALURI, 55100, KUALA LUMPUR"
            };

            setLoading(false);

            navigate('/signup-step2', {
                state: {
                    icNumber: mockResult.icNumber,
                    fullName: mockResult.fullName,
                    address: mockResult.address,
                    frontImage: frontImg,
                    backImage: backImg
                }
            });
        }, 1000);
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
                variant="text"
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate('/')}
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
                {t.home}
            </Button>

            <Card sx={{ 
                p: { xs: 2, sm: 2.5 }, 
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
                borderRadius: { xs: 2, sm: 3 },
                backgroundColor: '#fff',
                textAlign: 'center',
                width: '100%',
                maxWidth: '100%',
                boxSizing: 'border-box'
            }}>
                <Box sx={{ mb: { xs: 2, sm: 2.5 } }}>
                    <HealthcareHeader title={t.scanTitle} />
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1.5, sm: 2 }, width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>

                    {/* Webcam view */}
                    {!frontImg || !backImg ? (
                        <Box sx={{ 
                            border: '2px solid #E8D5FF', 
                            borderRadius: { xs: 2, sm: 3 }, 
                            overflow: 'hidden',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                            width: '100%',
                            maxWidth: '100%'
                        }}>
                            <Webcam
                                audio={false}
                                ref={webcamRef}
                                screenshotFormat="image/jpeg"
                                width="100%"
                                style={{ width: '100%', height: 'auto', maxWidth: '100%' }}
                                videoConstraints={{ facingMode: "environment" }}
                            />
                        </Box>
                    ) : null}

                    {/* Preview captured images */}
                    {frontImg && (
                        <Card sx={{ 
                            display: 'flex', 
                            p: { xs: 1.5, sm: 2 }, 
                            alignItems: 'center', 
                            gap: { xs: 1.5, sm: 2 },
                            backgroundColor: '#F5F0FF',
                            border: '1px solid #E8D5FF',
                            borderRadius: 2,
                            width: '100%',
                            maxWidth: '100%'
                        }}>
                            <CardMedia 
                                component="img" 
                                image={frontImg} 
                                sx={{ width: { xs: 60, sm: 80 }, height: { xs: 40, sm: 50 }, borderRadius: 1, flexShrink: 0 }} 
                            />
                            <Typography variant="body2" sx={{ fontWeight: 500, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                                {t.frontCaptured}
                            </Typography>
                        </Card>
                    )}
                    {backImg && (
                        <Card sx={{ 
                            display: 'flex', 
                            p: { xs: 1.5, sm: 2 }, 
                            alignItems: 'center', 
                            gap: { xs: 1.5, sm: 2 },
                            backgroundColor: '#F5F0FF',
                            border: '1px solid #E8D5FF',
                            borderRadius: 2,
                            width: '100%',
                            maxWidth: '100%'
                        }}>
                            <CardMedia 
                                component="img" 
                                image={backImg} 
                                sx={{ width: { xs: 60, sm: 80 }, height: { xs: 40, sm: 50 }, borderRadius: 1, flexShrink: 0 }} 
                            />
                            <Typography variant="body2" sx={{ fontWeight: 500, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                                {t.backCaptured}
                            </Typography>
                        </Card>
                    )}

                    {/* Buttons */}
                    {!frontImg && (
                        <Button 
                            variant="contained" 
                            size="large" 
                            onClick={() => capture(setFrontImg)}
                            sx={{
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
                                }
                            }}
                        >
                            {t.captureFront}
                        </Button>
                    )}
                    {frontImg && !backImg && (
                        <Button 
                            variant="contained" 
                            size="large" 
                            onClick={() => capture(setBackImg)}
                            sx={{
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
                                }
                            }}
                        >
                            {t.captureBack}
                        </Button>
                    )}
                    {frontImg && backImg && (
                        <Box sx={{ display: 'flex', gap: { xs: 1.5, sm: 2 }, mt: 2 }}>
                            <Button 
                                variant="outlined" 
                                fullWidth 
                                onClick={handleRetake} 
                                disabled={loading}
                                sx={{
                                    borderColor: '#EF4444',
                                    color: '#EF4444',
                                    fontWeight: 'bold',
                                    py: { xs: 1.25, sm: 1.5 },
                                    fontSize: { xs: '0.875rem', sm: '1rem' },
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    borderWidth: 2,
                                    '&:hover': {
                                        borderColor: '#DC2626',
                                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                        borderWidth: 2,
                                    },
                                    '&:disabled': {
                                        borderColor: '#E0E0E0',
                                        color: '#E0E0E0',
                                    }
                                }}
                            >
                                {t.retake}
                            </Button>
                            <Button 
                                variant="contained" 
                                fullWidth 
                                onClick={handleNext} 
                                disabled={loading}
                                sx={{
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
                            >
                                {loading ? <CircularProgress size={20} sx={{ color: '#1a1a1a' }} /> : t.next}
                            </Button>
                        </Box>
                    )}
                </Box>
            </Card>
        </Container>
    );
};

export default SignUpStep1;