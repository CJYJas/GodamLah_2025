import React, { useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Button, Fab, CircularProgress, Card } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { keyframes } from '@emotion/react';
import axios from 'axios';
import { useLanguage } from '../context/LanguageContext'; // ✅ Import Hook

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(211, 47, 47, 0.4); transform: scale(1); }
  50% { box-shadow: 0 0 0 25px rgba(211, 47, 47, 0); transform: scale(1.1); }
  100% { box-shadow: 0 0 0 0 rgba(211, 47, 47, 0); transform: scale(1); }
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

            await axios.post("http://localhost:8000/signup-voice", formData);

        } catch (error) {
            console.log("Backend offline? Continuing in Mock Mode...");
        } finally {
            setUploading(false);
            // Navigate to Security Questions page
            navigate('/signup-security', { state });
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 5, textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom>
                {t.voiceTitle} {/* "Record Your Voice" */}
            </Typography>

            <Card sx={{ p: 4, mb: 4, bgcolor: '#f5f5f5' }}>
                <Typography variant="subtitle1" color="text.secondary">
                    {t.readAloud} {/* "Please read the following aloud:" */}
                </Typography>
                <Typography variant="h6" color="primary" sx={{ my: 2, fontStyle: 'italic', fontWeight: 'bold', lineHeight: 1.4 }}>
                    "{t.voiceSentence(fullName, icNumber)}" {/* "My name is X..." */}
                </Typography>
            </Card>

            <Box sx={{ height: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <Fab
                    color={isRecording ? "error" : "primary"}
                    aria-label="record"
                    onClick={isRecording ? stopRecording : startRecording}
                    sx={{
                        width: 110,
                        height: 110,
                        mb: 2,
                        zIndex: 10,
                        animation: isRecording ? `${pulse} 1.5s infinite` : 'none',
                        transition: 'all 0.3s ease-in-out'
                    }}
                >
                    {isRecording ? <StopIcon sx={{ fontSize: 60 }} /> : <MicIcon sx={{ fontSize: 60 }} />}
                </Fab>

                <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                    {isRecording ? t.listening : (audioBlob ? t.process : t.startRecord)}
                    {/* "Listening..." OR "Process & Next" OR "Tap to Record" */}
                </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                <Button
                    variant="outlined"
                    color="inherit"
                    startIcon={<ArrowBackIcon />}
                    fullWidth
                    onClick={() => navigate(-1)}
                >
                    {t.back} {/* "Back" */}
                </Button>

                <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    disabled={!audioBlob || uploading}
                    onClick={handleNext}
                >
                    {uploading ? <CircularProgress size={24} color="inherit" /> : t.next} {/* "Next" */}
                </Button>
            </Box>
        </Container>
    );
};

export default SignUpVoice;