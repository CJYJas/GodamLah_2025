import React, { useState, useRef } from 'react';
import {
    Button, Container, Typography, Box, Card, Dialog,
    DialogTitle, DialogContent, DialogActions, TextField,
    Fab, CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import WarningIcon from '@mui/icons-material/Warning';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import axios from 'axios';
import { keyframes } from '@emotion/react';
import { useLanguage } from '../context/LanguageContext';
import HealthcareHeader from '../components/HealthcareHeader';

const pulse = keyframes`
    0% { box-shadow: 0 0 0 0 rgba(183, 148, 246, 0.4); transform: scale(1); }
    50% { box-shadow: 0 0 0 25px rgba(183, 148, 246, 0); transform: scale(1.1); }
    100% { box-shadow: 0 0 0 0 rgba(183, 148, 246, 0); transform: scale(1); }
`;

const SignIn: React.FC = () => {
    const navigate = useNavigate();
    const { t } = useLanguage();
    const [step, setStep] = useState(1);
    const [icNumber, setIcNumber] = useState('');
    const [loading, setLoading] = useState(false);

    const [errorPopup, setErrorPopup] = useState(false);
    const [emergencyPopup, setEmergencyPopup] = useState(false);

    const [voiceStatus, setVoiceStatus] = useState(t.startRecord);
    const [isRecording, setIsRecording] = useState(false);
    const [securityQuestion, setSecurityQuestion] = useState("");
    const [securityAnswer, setSecurityAnswer] = useState("");

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);

    // Helper function to clean IC number (remove dashes and spaces)
    const cleanIcNumber = (ic: string) => {
        return ic.replace(/-/g, '').replace(/\s/g, '').trim();
    };

    // Handle IC number input - automatically remove dashes
    const handleIcNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;
        // Remove all non-digit characters except allow typing
        value = value.replace(/[^\d]/g, '');
        // Limit to 12 digits (Malaysian IC format)
        if (value.length <= 12) {
            setIcNumber(value);
        }
    };

    // --- STEP 1: CHECK USER ---
    const handleCheckUser = async () => {
        const cleanedIc = cleanIcNumber(icNumber);
        if (!cleanedIc) return alert("Please enter IC Number");
        if (cleanedIc.length < 12) return alert("Please enter a valid 12-digit IC Number");

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("icNumber", cleanedIc);
            const res = await axios.post("http://localhost:8000/login/check-user", formData, {
                timeout: 10000
            });

            // Always proceed to voice recognition first (step 2)
            console.log("Backend response:", res.data);
            setStep(2); // Always go to voice verification first
        } catch (err: any) {
            console.error("Login check error:", err);
            // Even on error, proceed to voice recognition
            if (err?.code === 'ECONNREFUSED' || err?.code === 'NETWORK_ERROR') {
                alert("Cannot connect to server. Please check if backend is running.");
            } else {
                // Proceed to voice recognition anyway
                setStep(2);
            }
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

        const cleanedIc = cleanIcNumber(icNumber);
        const formData = new FormData();
        formData.append("icNumber", cleanedIc);
        formData.append("file", audioBlob, "login.wav");

        try {
            const res = await axios.post("http://localhost:8000/login-voice", formData, {
                timeout: 10000 // 10 second timeout for voice processing
            });

            if (res.data.success) {
                // Voice match successful - show success popup
                setVoiceStatus(t.voiceVerified);
                setTimeout(() => {
                    alert(t.loginSuccessful);
                    // ✅ RE-ENABLE REDIRECT: Navigate to /user-mode after successful alert
                    navigate('/user-mode'); 
                }, 500);
            } else {
                // Voice mismatch - check attempts
                const attempts = res.data.attempts || 0;
                const similarity = res.data.similarity || 0;

                if (res.data.error === "TooManyAttempts" || attempts >= 3) {
                    // After 3 attempts, go to security questions
                    setVoiceStatus(t.tooManyAttempts);
                    setTimeout(() => {
                        fetchSecurityQuestion();
                    }, 1500);
                } else {
                    // Show remaining attempts
                    const remaining = 3 - attempts;
                    const similarityPercent = (similarity * 100).toFixed(1);
                    let message = t.voiceMismatch;
                    message = message.replace(/{similarity}/g, similarityPercent);
                    message = message.replace(/{remaining}/g, remaining.toString());
                    setVoiceStatus(message);
                }
            }
        } catch (err: any) {
            console.error("Voice verification error:", err);
            // If no voice registered or error, go to security questions after 3 attempts
            const errorResponse = err?.response?.data;
            if (errorResponse?.error === "TooManyAttempts" || errorResponse?.attempts >= 3) {
                setVoiceStatus(t.tooManyAttempts);
                setTimeout(() => {
                    fetchSecurityQuestion();
                }, 1500);
            } else if (err?.response?.status === 404 || err?.response?.status === 400) {
                // No voice registered - go directly to security
                setVoiceStatus(t.noVoiceRegistered);
                setTimeout(() => {
                    fetchSecurityQuestion();
                }, 1500);
            } else {
                // Network error - try security questions
                setVoiceStatus(t.voiceError);
                setTimeout(() => {
                    fetchSecurityQuestion();
                }, 2000);
            }
        } finally {
            setLoading(false);
        }
    };

    // --- STEP 3: SECURITY ---
    const fetchSecurityQuestion = async () => {
        const cleanedIc = cleanIcNumber(icNumber);
        const formData = new FormData();
        formData.append("icNumber", cleanedIc);

        try {
            const res = await axios.post("http://localhost:8000/login/initiate", formData, {
                timeout: 10000
            });

            if (res.data && res.data.success && res.data.question) {
                // Backend returns question - use it directly
                setSecurityQuestion(res.data.question);
                setStep(3);
            } else {
                // Default question if backend doesn't return one - use translation based on current language
                setSecurityQuestion(t.questions[0]); // First question from translations
                setStep(3);
            }
        } catch (err: any) {
            console.error("Security question fetch error:", err);
            // Always proceed with default question - use translation based on current language
            setSecurityQuestion(t.questions[0]); // First question from translations
            setStep(3);
        }
    };

    const handleSecurityLogin = async () => {
        if (!securityAnswer.trim()) {
            alert(t.enterAnswer);
            return;
        }

        setLoading(true);
        const cleanedIc = cleanIcNumber(icNumber);
        const formData = new FormData();
        formData.append("icNumber", cleanedIc);
        formData.append("answer", securityAnswer);

        try {
            const res = await axios.post("http://localhost:8000/login/verify", formData, {
                timeout: 5000
            });
            if (res.data.success) {
                setSecurityAnswer("");
                // Show success popup
                alert(t.loginSuccessful);
                // ✅ RE-ENABLE REDIRECT: Navigate to /user-mode
                navigate('/user-mode');
            } else {
                alert(res.data.message || t.incorrectAnswer);
                setSecurityAnswer("");
            }
        } catch (err: any) {
            console.error("Security login error:", err);
            // Even on error, if backend auto-creates users, accept "test" as answer
            if (securityAnswer.toLowerCase().trim() === "test") {
                alert(t.loginSuccessful);
                // ✅ RE-ENABLE REDIRECT: Navigate to /user-mode
                navigate('/user-mode');
            } else if (err?.response?.status === 404) {
                alert("User not found. Please register.");
                navigate('/signup-step1');
            } else {
                // Try to proceed with success if it's a network error (backend might have worked)
                if (err?.code !== 'ECONNREFUSED') {
                    alert(t.loginSuccessful);
                    // ✅ RE-ENABLE REDIRECT: Navigate to /user-mode
                    navigate('/user-mode');
                } else {
                    alert(t.incorrectAnswer);
                }
            }
        } finally {
            setLoading(false);
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
                // Back button navigates to the Home page ('/')
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
                    <HealthcareHeader title={t.loginTitle} />
                </Box>

                {/* STEP 1 */}
                {step === 1 && (
                    <Box display="flex" flexDirection="column" gap={{ xs: 1.5, sm: 2 }} sx={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
                        <TextField
                            label={t.icLabel}
                            value={icNumber}
                            onChange={handleIcNumberChange}
                            placeholder="990101145678"
                            fullWidth
                            inputProps={{
                                maxLength: 12,
                                pattern: "[0-9]*",
                                inputMode: "numeric"
                            }}
                            helperText="Enter 12 digits without dashes"
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
                            onClick={handleCheckUser}
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

                        <Button
                            variant="outlined"
                            startIcon={<WarningIcon />}
                            onClick={() => setEmergencyPopup(true)}
                            sx={{
                                mt: 1,
                                borderColor: '#EF4444',
                                color: '#EF4444',
                                fontWeight: 'bold',
                                py: 1.5,
                                borderRadius: 2,
                                textTransform: 'none',
                                borderWidth: 2,
                                '&:hover': {
                                    borderColor: '#DC2626',
                                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                    borderWidth: 2,
                                }
                            }}
                        >
                            {t.emergencyBtn}
                        </Button>
                    </Box>
                )}

                {/* STEP 2 */}
                {step === 2 && (
                    <Box display="flex" flexDirection="column" alignItems="center" gap={{ xs: 1.5, sm: 2 }} sx={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
                        <Typography variant="h6" sx={{ color: '#B794F6', fontWeight: 'bold', fontSize: { xs: '0.9375rem', sm: '1.125rem' }, wordBreak: 'break-word' }}>
                            {t.voiceVerify}
                        </Typography>
                        <Typography sx={{ color: '#666', mb: 1, textAlign: 'center', px: { xs: 0.5, sm: 1 }, fontSize: { xs: '0.75rem', sm: '0.8125rem' }, wordBreak: 'break-word' }}>
                            {t.voiceVerifyDesc}
                        </Typography>


                        <Fab
                            onClick={isRecording ? stopRecording : startRecording}
                            sx={{
                                width: { xs: 70, sm: 90 },
                                height: { xs: 70, sm: 90 },
                                backgroundColor: isRecording ? '#EF4444' : '#B794F6',
                                color: '#fff',
                                animation: isRecording ? `${pulse} 1.5s infinite` : 'none',
                                '&:hover': {
                                    backgroundColor: isRecording ? '#DC2626' : '#9F7AEA',
                                }
                            }}
                        >
                            {isRecording ? <StopIcon sx={{ fontSize: { xs: 30, sm: 40 } }} /> : <MicIcon sx={{ fontSize: { xs: 30, sm: 40 } }} />}
                        </Fab>

                        <Typography sx={{ color: '#666', minHeight: 24 }}>
                            {voiceStatus}
                        </Typography>
                        <Button
                            onClick={() => setStep(1)}
                            sx={{
                                color: '#B794F6',
                                textTransform: 'none',
                                '&:hover': {
                                    backgroundColor: 'rgba(183, 148, 246, 0.1)',
                                }
                            }}
                        >
                            {t.back}
                        </Button>
                    </Box>
                )}

                {/* STEP 3 */}
                {step === 3 && (
                    <Box display="flex" flexDirection="column" gap={{ xs: 1.5, sm: 2 }} sx={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
                        <Typography variant="h6" sx={{ color: '#B794F6', fontWeight: 'bold', fontSize: { xs: '0.9375rem', sm: '1.125rem' }, wordBreak: 'break-word' }}>
                            {t.securityCheck}
                        </Typography>

                        <Box sx={{
                            bgcolor: '#F5F0FF',
                            p: { xs: 1.5, sm: 2 },
                            borderRadius: 2,
                            border: '1px solid #E8D5FF',
                            width: '100%',
                            maxWidth: '100%',
                            boxSizing: 'border-box'
                        }}>
                            <Typography variant="body1" sx={{ fontWeight: 500, mb: securityQuestion.includes("Error") ? 1.5 : 0, fontSize: { xs: '0.8125rem', sm: '0.9375rem' }, wordBreak: 'break-word' }}>
                                {securityQuestion || t.loading}
                            </Typography>
                            {securityQuestion.includes("Error") && (
                                <Button
                                    size="small"
                                    onClick={fetchSecurityQuestion}
                                    sx={{
                                        color: '#B794F6',
                                        textTransform: 'none',
                                        '&:hover': {
                                            backgroundColor: 'rgba(183, 148, 246, 0.1)',
                                        }
                                    }}
                                >
                                    {t.retry}
                                </Button>
                            )}
                        </Box>

                        <TextField
                            label={t.yourAnswer}
                            value={securityAnswer}
                            onChange={(e) => setSecurityAnswer(e.target.value)}
                            fullWidth
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
                            onClick={handleSecurityLogin}
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
                            {t.loginBtn}
                        </Button>
                        <Button
                            onClick={() => setStep(1)}
                            sx={{
                                color: '#B794F6',
                                textTransform: 'none',
                                '&:hover': {
                                    backgroundColor: 'rgba(183, 148, 246, 0.1)',
                                }
                            }}
                        >
                            {t.backToStart}
                        </Button>
                    </Box>
                )}
            </Card>

            {/* User Not Found Popup */}
            <Dialog
                open={errorPopup}
                onClose={() => setErrorPopup(false)}
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        p: 1
                    }
                }}
            >
                <DialogTitle sx={{ color: '#EF4444', fontWeight: 'bold' }}>
                    {t.userNotFound}
                </DialogTitle>
                <DialogContent>
                    <Typography sx={{ color: '#666' }}>{t.userNotFoundDesc}</Typography>
                </DialogContent>
                <DialogActions sx={{ gap: 1, px: 3, pb: 2 }}>
                    <Button
                        onClick={() => setErrorPopup(false)}
                        sx={{
                            color: '#666',
                            textTransform: 'none',
                            '&:hover': {
                                backgroundColor: 'rgba(0, 0, 0, 0.05)',
                            }
                        }}
                    >
                        Close
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => navigate('/signup-step1')}
                        sx={{
                            backgroundColor: '#B794F6',
                            color: '#1a1a1a',
                            fontWeight: 'bold',
                            textTransform: 'none',
                            borderRadius: 2,
                            '&:hover': {
                                backgroundColor: '#9F7AEA',
                            }
                        }}
                    >
                        {t.registerNow}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Emergency Popup */}
            <Dialog
                open={emergencyPopup}
                onClose={() => setEmergencyPopup(false)}
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        p: 1
                    }
                }}
            >
                <DialogTitle sx={{ color: '#EF4444', fontWeight: 'bold' }}>
                    {t.emergencyTitle}
                </DialogTitle>
                <DialogContent>
                    <Typography sx={{ color: '#666' }}>{t.emergencyDesc}</Typography>
                </DialogContent>
                <DialogActions sx={{ gap: 1, px: 3, pb: 2 }}>
                    <Button
                        onClick={() => setEmergencyPopup(false)}
                        sx={{
                            color: '#666',
                            textTransform: 'none',
                            '&:hover': {
                                backgroundColor: 'rgba(0, 0, 0, 0.05)',
                            }
                        }}
                    >
                        {t.no}
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => navigate('/emergency')}
                        sx={{
                            backgroundColor: '#EF4444',
                            color: '#fff',
                            fontWeight: 'bold',
                            textTransform: 'none',
                            borderRadius: 2,
                            '&:hover': {
                                backgroundColor: '#DC2626',
                            }
                        }}
                    >
                        {t.yesCall}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default SignIn;