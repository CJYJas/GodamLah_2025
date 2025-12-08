import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Container, Typography, Box, Button, TextField,
    Card, MenuItem, Select, FormControl, InputLabel, Stack,
    CircularProgress
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import axios from 'axios';
import { useLanguage } from '../context/LanguageContext';

const SignUpSecurity: React.FC = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { t } = useLanguage();
    const [loading, setLoading] = useState(false);

    // Form State (initialized from state if user navigated back)
    const [q1, setQ1] = useState(state?.q1 || '');
    const [a1, setA1] = useState(state?.a1 || '');
    const [q2, setQ2] = useState(state?.q2 || '');
    const [a2, setA2] = useState(state?.a2 || '');

    const handleNext = async () => {
        // 1. Validation: Ensure all fields are filled
        if (!q1 || !a1 || !q2 || !a2) {
            return alert("Please answer both security questions.");
        }

        // 2. Safety Check: Ensure we have the IC Number from previous steps
        // This prevents saving "orphaned" data if the page was refreshed.
        if (!state?.icNumber) {
            alert("Session lost. Please start registration again.");
            navigate('/signup-step1');
            return;
        }

        setLoading(true);

        try {
            // 3. Prepare JSON Payload
            const payload = {
                ic_number: state.icNumber,
                question1: q1,
                answer1: a1,
                question2: q2,
                answer2: a2
            };

            // 4. Send to Backend (Step-by-step saving)
            await axios.post("http://localhost:8000/signup-security", payload);

            // 5. Navigate to Final Step (User Mode)
            // We pass the state forward so User Mode has everything it needs to finalize.
            navigate('/user-mode', {
                state: {
                    ...state,
                    q1, a1, q2, a2 // Update these in state just in case
                }
            });

        } catch (error) {
            console.error("Backend Error:", error);
            // Optional: Mock Success for offline testing if backend is down
            alert("Connection Error. Proceeding in Offline Mode.");
            navigate('/user-mode', {
                state: { ...state, q1, a1, q2, a2 }
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 5 }}>
            <Card sx={{ p: 4, boxShadow: 3 }}>
                <Typography variant="h4" align="center" gutterBottom fontWeight="bold">
                    {t.securityTitle}
                </Typography>
                <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 4 }}>
                    {t.securityDesc}
                </Typography>

                <Stack spacing={3}>
                    {/* --- Question 1 --- */}
                    <Box>
                        <FormControl fullWidth>
                            <InputLabel>{t.q1Label}</InputLabel>
                            <Select
                                value={q1}
                                label={t.q1Label}
                                onChange={(e) => setQ1(e.target.value)}
                            >
                                {t.questions.map((q: string) => (
                                    <MenuItem key={q} value={q}>{q}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField
                            fullWidth
                            label={t.a1Label}
                            sx={{ mt: 1 }}
                            value={a1}
                            onChange={(e) => setA1(e.target.value)}
                        />
                    </Box>

                    {/* --- Question 2 --- */}
                    <Box>
                        <FormControl fullWidth>
                            <InputLabel>{t.q2Label}</InputLabel>
                            <Select
                                value={q2}
                                label={t.q2Label}
                                onChange={(e) => setQ2(e.target.value)}
                            >
                                {t.questions.map((q: string) => (
                                    <MenuItem key={q} value={q}>{q}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField
                            fullWidth
                            label={t.a2Label}
                            sx={{ mt: 1 }}
                            value={a2}
                            onChange={(e) => setA2(e.target.value)}
                        />
                    </Box>
                </Stack>

                {/* --- Buttons --- */}
                <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
                    <Button
                        variant="outlined"
                        color="inherit"
                        startIcon={<ArrowBackIcon />}
                        fullWidth
                        onClick={() => navigate(-1)}
                    >
                        {t.back}
                    </Button>

                    <Button
                        variant="contained"
                        endIcon={!loading && <ArrowForwardIcon />}
                        size="large"
                        fullWidth
                        onClick={handleNext}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : (t.next || "Next")}
                    </Button>
                </Box>
            </Card>
        </Container>
    );
};

export default SignUpSecurity;