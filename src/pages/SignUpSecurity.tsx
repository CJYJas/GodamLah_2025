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
import HealthcareHeader from '../components/HealthcareHeader';

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

        // 1.5. Validation: Ensure questions are different
        if (q1 === q2) {
            return alert("Please select two different security questions.");
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

        } catch (error: any) {
            console.error("Backend Error:", error);
            // Only show alert for validation errors (400), silently continue for network errors
            if (error?.response?.status === 400) {
                const errorMessage = error?.response?.data?.detail || error?.message || "Please check your inputs.";
                alert(errorMessage);
            } else {
                // Network error - silently continue and save locally
                console.log("Network error, proceeding with local state...");
                navigate('/user-mode', {
                    state: { ...state, q1, a1, q2, a2 }
                });
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
                <Box sx={{ mb: { xs: 1.5, sm: 2 } }}>
                    <HealthcareHeader title={t.securityTitle} />
                </Box>
                <Typography 
                    variant="body2" 
                    align="center" 
                    sx={{ 
                        color: '#666',
                        mb: { xs: 2.5, sm: 3 },
                        fontSize: { xs: '0.75rem', sm: '0.8125rem' },
                        wordBreak: 'break-word',
                        px: { xs: 0.5, sm: 0 }
                    }}
                >
                    {t.securityDesc}
                </Typography>

                <Stack spacing={{ xs: 1.5, sm: 2 }} sx={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
                    {/* --- Question 1 --- */}
                    <Box>
                        <FormControl fullWidth>
                            <InputLabel sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>{t.q1Label}</InputLabel>
                            <Select
                                value={q1}
                                label={t.q1Label}
                                onChange={(e) => {
                                    setQ1(e.target.value);
                                    // If same as q2, clear q2
                                    if (e.target.value === q2) {
                                        setQ2('');
                                    }
                                }}
                                sx={{
                                    borderRadius: 2,
                                    fontSize: { xs: '0.875rem', sm: '1rem' }
                                }}
                            >
                                {t.questions
                                    .filter((q: string) => q !== q2) // Exclude q2 from q1 options
                                    .map((q: string) => (
                                        <MenuItem key={q} value={q}>{q}</MenuItem>
                                    ))}
                            </Select>
                        </FormControl>
                        <TextField
                            fullWidth
                            label={t.a1Label}
                            sx={{ 
                                mt: 1,
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                }
                            }}
                            value={a1}
                            onChange={(e) => setA1(e.target.value)}
                        />
                    </Box>

                    {/* --- Question 2 --- */}
                    <Box>
                        <FormControl fullWidth>
                            <InputLabel sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>{t.q2Label}</InputLabel>
                            <Select
                                value={q2}
                                label={t.q2Label}
                                onChange={(e) => {
                                    setQ2(e.target.value);
                                    // If same as q1, clear q1
                                    if (e.target.value === q1) {
                                        setQ1('');
                                    }
                                }}
                                sx={{
                                    borderRadius: 2,
                                    fontSize: { xs: '0.875rem', sm: '1rem' }
                                }}
                            >
                                {t.questions
                                    .filter((q: string) => q !== q1) // Exclude q1 from q2 options
                                    .map((q: string) => (
                                        <MenuItem key={q} value={q}>{q}</MenuItem>
                                    ))}
                            </Select>
                        </FormControl>
                        <TextField
                            fullWidth
                            label={t.a2Label}
                            sx={{ 
                                mt: 1,
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    fontSize: { xs: '0.875rem', sm: '1rem' }
                                },
                                '& .MuiInputLabel-root': {
                                    fontSize: { xs: '0.875rem', sm: '1rem' }
                                }
                            }}
                            value={a2}
                            onChange={(e) => setA2(e.target.value)}
                        />
                    </Box>
                </Stack>

                {/* --- Buttons --- */}
                <Box sx={{ display: 'flex', gap: { xs: 1.25, sm: 1.5 }, mt: { xs: 2.5, sm: 3 }, width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
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
                        endIcon={!loading && <ArrowForwardIcon />}
                        size="large"
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
                        {loading ? <CircularProgress size={20} sx={{ color: '#1a1a1a' }} /> : (t.next || "Next")}
                    </Button>
                </Box>
            </Card>
        </Container>
    );
};

export default SignUpSecurity;