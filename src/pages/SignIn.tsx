import React, { useState, useRef } from 'react';
import {
    Button, Container, Typography, Box, Card, Dialog,
    DialogTitle, DialogContent, DialogActions, TextField,
    Fab
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import WarningIcon from '@mui/icons-material/Warning';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import axios from 'axios';
import { keyframes } from '@emotion/react';
import { useLanguage } from '../context/LanguageContext'; // ✅ Import Translation Hook

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(25, 118, 210, 0.4); transform: scale(1); }
  50% { box-shadow: 0 0 0 15px rgba(25, 118, 210, 0); transform: scale(1.1); }
  100% { box-shadow: 0 0 0 0 rgba(25, 118, 210, 0); transform: scale(1); }
`;

const SignIn: React.FC = () => {
    const navigate = useNavigate();
    const { t } = useLanguage(); // ✅ Get Translations
    const [step, setStep] = useState(1);
    const [icNumber, setIcNumber] = useState('');
    const [loading, setLoading] = useState(false);

    const [errorPopup, setErrorPopup] = useState(false);
    const [emergencyPopup, setEmergencyPopup] = useState(false);

    const [voiceStatus, setVoiceStatus] = useState(t.startRecord); // "Tap to Record"
    const [isRecording, setIsRecording] = useState(false);
    const [securityQuestion, setSecurityQuestion] = useState("");
    const [securityAnswer, setSecurityAnswer] = useState("");

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);

    // --- STEP 1: CHECK USER ---
    const handleCheckUser = async () => {
        if (!icNumber) return alert("Please enter IC Number");
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("icNumber", icNumber);
            const res = await axios.post("http://localhost:8000/login/check-user", formData);

            if (res.data.success) {
                setStep(2);
            } else {
                setErrorPopup(true);
            }
        } catch (err) {
            alert(t.error); // "Error"
        } finally {
            setLoading(false);
        }
    };

    // --- STEP 2: VOICE ---
    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            const chunks: BlobPart[] = [];

            mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
            mediaRecorder.onstop = () => {
                const blob = new Blob(chunks, { type: 'audio/wav' });
                verifyVoice(blob);
            };

            mediaRecorder.start();
            setIsRecording(true);
            setVoiceStatus(t.listening); // "Listening..."
        } catch (err) {
            alert("Microphone denied.");
        }
    };

    const stopRecording = () => {
        mediaRecorderRef.current?.stop();
        setIsRecording(false);
    };

    const verifyVoice = async (audioBlob: Blob) => {
        setLoading(true);
        setVoiceStatus(t.loading); // "Loading..."

        const formData = new FormData();
        formData.append("icNumber", icNumber);
        formData.append("file", audioBlob, "login.wav");

        try {
            const res = await axios.post("http://localhost:8000/login-voice", formData);

            if (res.data.success) {
                alert("Login Successful!");
            } else {
                setVoiceStatus("Voice mismatch. Try again.");
                if (res.data.error === "TooManyAttempts") {
                    fetchSecurityQuestion();
                }
            }
        } catch (err) {
            setVoiceStatus(t.error);
        } finally {
            setLoading(false);
        }
    };

    // --- STEP 3: SECURITY ---
    const fetchSecurityQuestion = async () => {
        const formData = new FormData();
        formData.append("icNumber", icNumber);

        try {
            const res = await axios.post("http://localhost:8000/login/initiate", formData);

            if (res.data.success && res.data.question) {
                setSecurityQuestion(res.data.question);
                setStep(3);
            } else {
                setSecurityQuestion("Error: No question found.");
            }
        } catch (err) {
            setSecurityQuestion(t.error);
        }
    };

    const handleSecurityLogin = async () => {
        const formData = new FormData();
        formData.append("icNumber", icNumber);
        formData.append("answer", securityAnswer);

        try {
            const res = await axios.post("http://localhost:8000/login/verify", formData);
            if (res.data.success) {
                alert("Login Successful!");
            } else {
                alert("Incorrect Answer");
            }
        } catch (err) {
            alert(t.error);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 5 }}>
            <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/')} sx={{ mb: 2 }}>
                {t.home} {/* "Home" */}
            </Button>

            <Card sx={{ p: 4, boxShadow: 3, textAlign: 'center' }}>
                <Typography variant="h4" gutterBottom fontWeight="bold">{t.loginTitle}</Typography>

                {/* STEP 1 */}
                {step === 1 && (
                    <Box display="flex" flexDirection="column" gap={2}>
                        <TextField
                            label={t.icLabel} // "IC Number"
                            value={icNumber}
                            onChange={(e) => setIcNumber(e.target.value)}
                            fullWidth
                        />

                        <Button variant="contained" size="large" onClick={handleCheckUser} disabled={loading}>
                            {loading ? t.loading : t.next} {/* "Next" */}
                        </Button>

                        <Button
                            variant="contained"
                            color="error"
                            startIcon={<WarningIcon />}
                            onClick={() => setEmergencyPopup(true)}
                            sx={{ mt: 2 }}
                        >
                            {t.emergencyBtn} {/* "Emergency" */}
                        </Button>
                    </Box>
                )}

                {/* STEP 2 */}
                {step === 2 && (
                    <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
                        <Typography color="primary" variant="h6">{t.voiceVerify}</Typography>
                        <Typography>{t.sayName}</Typography>

                        <Fab
                            color={isRecording ? "error" : "primary"}
                            onClick={isRecording ? stopRecording : startRecording}
                            sx={{ width: 80, height: 80, animation: isRecording ? `${pulse} 1.5s infinite` : 'none' }}
                        >
                            {isRecording ? <StopIcon /> : <MicIcon />}
                        </Fab>

                        <Typography color="error">{voiceStatus}</Typography>
                        <Button onClick={() => setStep(1)}>{t.back}</Button>
                    </Box>
                )}

                {/* STEP 3 */}
                {step === 3 && (
                    <Box display="flex" flexDirection="column" gap={2}>
                        <Typography color="secondary" variant="h6">{t.securityCheck}</Typography>

                        <Box sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 1 }}>
                            <Typography variant="h6">{securityQuestion || t.loading}</Typography>
                            {/* If error, show retry button */}
                            {securityQuestion.includes("Error") && (
                                <Button size="small" onClick={fetchSecurityQuestion}>{t.retry}</Button>
                            )}
                        </Box>

                        <TextField
                            label={t.yourAnswer}
                            value={securityAnswer}
                            onChange={(e) => setSecurityAnswer(e.target.value)}
                        />

                        <Button variant="contained" onClick={handleSecurityLogin}>{t.loginBtn}</Button>
                        <Button onClick={() => setStep(1)}>{t.backToStart}</Button>
                    </Box>
                )}
            </Card>

            {/* User Not Found Popup */}
            <Dialog open={errorPopup} onClose={() => setErrorPopup(false)}>
                <DialogTitle sx={{ color: 'red' }}>{t.userNotFound}</DialogTitle>
                <DialogContent>
                    <Typography>{t.userNotFoundDesc}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setErrorPopup(false)}>Close</Button>
                    <Button variant="contained" onClick={() => navigate('/signup-step1')}>{t.registerNow}</Button>
                </DialogActions>
            </Dialog>

            {/* Emergency Popup */}
            <Dialog open={emergencyPopup} onClose={() => setEmergencyPopup(false)}>
                <DialogTitle color="error">{t.emergencyTitle}</DialogTitle>
                <DialogContent>{t.emergencyDesc}</DialogContent>
                <DialogActions>
                    <Button onClick={() => setEmergencyPopup(false)}>{t.no}</Button>
                    <Button variant="contained" color="error" onClick={() => navigate('/emergency')}>{t.yesCall}</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default SignIn;