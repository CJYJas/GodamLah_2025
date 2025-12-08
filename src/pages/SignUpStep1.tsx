import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { Button, Container, Typography, Box, CircularProgress, Card, CardMedia } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useLanguage } from '../context/LanguageContext'; // ✅ Import Translation Hook

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
        <Container maxWidth="sm">
            <Typography variant="h4" sx={{ my: 2, textAlign: 'center' }}>
                {t.scanTitle}
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

                {/* Webcam view */}
                {!frontImg || !backImg ? (
                    <Box sx={{ border: '2px solid #ccc', borderRadius: 2, overflow: 'hidden' }}>
                        <Webcam
                            audio={false}
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            width="100%"
                            videoConstraints={{ facingMode: "environment" }}
                        />
                    </Box>
                ) : null}

                {/* Preview captured images */}
                {frontImg && (
                    <Card sx={{ display: 'flex', p: 1, alignItems: 'center', gap: 2 }}>
                        <CardMedia component="img" image={frontImg} sx={{ width: 80, height: 50, borderRadius: 1 }} />
                        <Typography variant="body2">{t.frontCaptured}</Typography>
                    </Card>
                )}
                {backImg && (
                    <Card sx={{ display: 'flex', p: 1, alignItems: 'center', gap: 2 }}>
                        <CardMedia component="img" image={backImg} sx={{ width: 80, height: 50, borderRadius: 1 }} />
                        <Typography variant="body2">{t.backCaptured}</Typography>
                    </Card>
                )}

                {/* Buttons */}
                {!frontImg && (
                    <Button variant="contained" size="large" onClick={() => capture(setFrontImg)}>
                        {t.captureFront}
                    </Button>
                )}
                {frontImg && !backImg && (
                    <Button variant="contained" size="large" onClick={() => capture(setBackImg)}>
                        {t.captureBack}
                    </Button>
                )}
                {frontImg && backImg && (
                    <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                        <Button variant="outlined" color="error" fullWidth onClick={handleRetake} disabled={loading}>
                            {t.retake}
                        </Button>
                        <Button variant="contained" color="success" fullWidth onClick={handleNext} disabled={loading}>
                            {loading ? <CircularProgress size={24} color="inherit" /> : t.next}
                        </Button>
                    </Box>
                )}

                {/* BACK TO HOME BUTTON */}
                <Button
                    variant="text"
                    color="inherit"
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate('/')}
                    sx={{ mt: 2 }}
                >
                    {t.home}
                </Button>

            </Box>
        </Container>
    );
};

export default SignUpStep1;