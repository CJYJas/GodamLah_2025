import React, { useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Button, Fab, CircularProgress, Card } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { keyframes } from '@emotion/react';
import axios from 'axios';
import { useLanguage } from '../context/LanguageContext';
import HealthcareHeader from '../components/HealthcareHeader';

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(183, 148, 246, 0.4); transform: scale(1); }
  50% { box-shadow: 0 0 0 25px rgba(183, 148, 246, 0); transform: scale(1.1); }
  100% { box-shadow: 0 0 0 0 rgba(183, 148, 246, 0); transform: scale(1); }
`;

const SignUpVoice: React.FC = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { t } = useLanguage(); // ✅ Get translations

    const fullName = state?.fullName || "User";
    const icNumber = state?.icNumber || "990101-10-1234";

    const [isRecording, setIsRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [uploading, setUploading] = useState(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            const chunks: BlobPart[] = [];

            mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
            mediaRecorder.onstop = () => {
                const blob = new Blob(chunks, { type: 'audio/wav' });
                setAudioBlob(blob);
            };

            mediaRecorder.start();
            setIsRecording(true);
        } catch (err) {
            alert("Microphone access denied. Please allow permissions.");
        }
    };

    const stopRecording = () => {
        mediaRecorderRef.current?.stop();
        setIsRecording(false);
    };

    const handleNext = async () => {
        if (!audioBlob) return alert("Please record your voice first.");

        setUploading(true);

        try {
            const formData = new FormData();
            formData.append("voice_file", audioBlob, "voice.wav");
            formData.append("icNumber", icNumber);

            // Try to save voice silently - no popup on error
            await axios.post("http://localhost:8000/signup-voice", formData, {
                timeout: 5000 // 5 second timeout
            }).catch((error) => {
                // Silently log error but continue
                console.log("Voice save attempt:", error?.response?.status || "Network error");
            });
        } catch (error: any) {
            // Silently handle error - don't show popup
            console.log("Voice upload attempted, continuing...");
        } finally {
            setUploading(false);
            // Navigate to Security Questions page regardless of save status
            navigate('/signup-security', { state });
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
                textAlign: 'center',
                width: '100%',
                maxWidth: '100%',
                boxSizing: 'border-box'
            }}>
                <Box sx={{ mb: { xs: 1.5, sm: 2 } }}>
                    <HealthcareHeader title={t.voiceTitle} />
                </Box>

                <Card sx={{ 
                    p: { xs: 2, sm: 2.5 }, 
                    mb: { xs: 2, sm: 2.5 }, 
                    bgcolor: '#F5F0FF',
                    border: '1px solid #E8D5FF',
                    borderRadius: 2,
                    width: '100%',
                    maxWidth: '100%',
                    boxSizing: 'border-box'
                }}>
                    <Typography 
                        variant="subtitle1" 
                        sx={{ 
                            color: '#666', 
                            mb: 2, 
                            fontSize: { xs: '0.875rem', sm: '1rem' },
                            textAlign: 'center'
                        }}
                    >
                        {t.readAloud}
                    </Typography>
                    <Box sx={{ 
                        width: '100%',
                        maxWidth: '100%',
                        boxSizing: 'border-box'
                    }}>
                        <Typography 
                            variant="body1" 
                            sx={{ 
                                color: '#B794F6', 
                                fontStyle: 'italic', 
                                fontWeight: 'bold', 
                                lineHeight: 1.8,
                                fontSize: { xs: '0.8125rem', sm: '0.9375rem' },
                                wordBreak: 'break-word',
                                overflowWrap: 'break-word',
                                hyphens: 'auto',
                                textAlign: 'center',
                                px: { xs: 0.5, sm: 1 },
                                whiteSpace: 'normal',
                                display: 'block',
                                width: '100%',
                                boxSizing: 'border-box',
                                overflow: 'visible'
                            }}
                        >
                            "{t.voiceSentence(fullName, icNumber)}"
                        </Typography>
                    </Box>
                </Card>

                <Box sx={{ 
                    minHeight: { xs: 150, sm: 180 }, 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    mb: 1.5,
                    width: '100%',
                    maxWidth: '100%',
                    boxSizing: 'border-box'
                }}>
                    <Fab
                        aria-label="record"
                        onClick={isRecording ? stopRecording : startRecording}
                        sx={{
                            width: { xs: 85, sm: 110 },
                            height: { xs: 85, sm: 110 },
                            mb: 2,
                            zIndex: 10,
                            backgroundColor: isRecording ? '#EF4444' : '#B794F6',
                            color: '#fff',
                            animation: isRecording ? `${pulse} 1.5s infinite` : 'none',
                            transition: 'all 0.3s ease-in-out',
                            '&:hover': {
                                backgroundColor: isRecording ? '#DC2626' : '#9F7AEA',
                            }
                        }}
                    >
                        {isRecording ? <StopIcon sx={{ fontSize: { xs: 45, sm: 60 } }} /> : <MicIcon sx={{ fontSize: { xs: 45, sm: 60 } }} />}
                    </Fab>

                    <Typography variant="body2" sx={{ color: '#666', mt: 1, minHeight: 24 }}>
                        {isRecording ? t.listening : (audioBlob ? t.process : t.startRecord)}
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: { xs: 1.5, sm: 2 }, mt: 3 }}>
                    <Button
                        variant="outlined"
                        startIcon={<ArrowBackIcon />}
                        fullWidth
                        onClick={() => navigate(-1)}
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
                        {t.back}
                    </Button>

                    <Button
                        variant="contained"
                        size="large"
                        fullWidth
                        disabled={!audioBlob || uploading}
                        onClick={handleNext}
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
                        {uploading ? <CircularProgress size={20} sx={{ color: '#1a1a1a' }} /> : t.next}
                    </Button>
                </Box>
            </Card>
        </Container>
    );
};

export default SignUpVoice;