import React from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import HealthcareHeader from "../components/HealthcareHeader";

const Home: React.FC = () => {
    const navigate = useNavigate();
    const { language, toggleLanguage, t } = useLanguage();

    return (
        <Container 
            maxWidth="xs" 
            sx={{ 
                minHeight: { xs: '100vh', sm: 'calc(100vh - 45px)' },
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                py: { xs: 2, sm: 3 },
                px: { xs: 1.5, sm: 2 },
                width: '100%',
                maxWidth: '100%',
                backgroundColor: 'transparent',
                margin: '0 auto',
                boxSizing: 'border-box'
            }}
        >
            <HealthcareHeader 
                title="MyHealth"
                subtitle={language === "bm" 
                    ? "Aplikasi penjagaan kesihatan kerajaan Malaysia yang menyeluruh dan inklusif."
                    : "Malaysia's all-in-one, inclusive government healthcare app."
                }
            />

            {/* Action Buttons */}
            <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column',
                gap: { xs: 1.25, sm: 1.5 },
                width: '100%',
                maxWidth: '100%',
                mb: { xs: 2.5, sm: 3 },
                boxSizing: 'border-box'
            }}>
                <Button 
                    variant="contained" 
                    onClick={() => navigate("/signin")}
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
                            boxShadow: '0 6px 16px rgba(183, 148, 246, 0.4)',
                        }
                    }}
                >
                    {language === "bm" ? "Log Masuk" : "Sign In"}
                </Button>
                
                <Button 
                    variant="outlined" 
                    onClick={() => navigate("/signup-step1")}
                    sx={{
                        borderColor: '#B794F6',
                        color: '#1a1a1a',
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
                    {language === "bm" ? "Buat Akaun" : "Create Account"}
                </Button>
            </Box>

            {/* Language Toggle */}
            <Button 
                onClick={toggleLanguage}
                sx={{
                    color: '#B794F6',
                    textTransform: 'none',
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    fontWeight: 500,
                    mt: { xs: 1, sm: 2 },
                    px: { xs: 1, sm: 2 },
                    '&:hover': {
                        backgroundColor: 'rgba(183, 148, 246, 0.1)',
                    }
                }}
            >
                {language === "bm" ? "Switch to English" : "Tukar Ke Bahasa Malaysia"}
            </Button>
        </Container>
    );
};

export default Home;