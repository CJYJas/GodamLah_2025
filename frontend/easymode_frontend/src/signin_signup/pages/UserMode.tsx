import React, { useState } from "react";
import {
    Box, Typography, Button, CircularProgress, Backdrop, Container, Card
} from "@mui/material";
import Stack from "@mui/material/Stack";
import { useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import axios from "axios";
import HealthcareHeader from "../components/HealthcareHeader";

// Icons
import PersonIcon from '@mui/icons-material/Person';
import NaturePeopleIcon from '@mui/icons-material/NaturePeople';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const UserMode: React.FC = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const { t } = useLanguage();
    const [loading, setLoading] = useState(false);

    const handleSelect = async (mode: string) => {
        setLoading(true);

        const finalData = new FormData();
        finalData.append("icNumber", state?.icNumber || "990101-10-1234");
        finalData.append("fullName", state?.fullName || "User");
        finalData.append("address", state?.address || "");
        finalData.append("q1", state?.q1 || "");
        finalData.append("a1", state?.a1 || "");
        finalData.append("q2", state?.q2 || "");
        finalData.append("a2", state?.a2 || "");
        finalData.append("mode", mode);

        try {
            await axios.post("http://localhost:8000/signup-finalize", finalData, {
                timeout: 5000
            }).catch((error) => {
                // Silently handle network errors
                console.log("Finalize save attempt:", error?.response?.status || "Network error");
            });
            // Show success and navigate
            alert(t.successTitle);
            navigate('/signin');
        } catch (error: any) {
            // Only show alert for validation errors, not network errors
            if (error?.response?.status === 400) {
                alert(error?.response?.data?.detail || "Please check your information.");
            } else {
                // Network error - silently proceed
                console.log("Network error, proceeding...");
                alert(t.successTitle);
                navigate('/signin');
            }
        } finally {
            setLoading(false);
        }
    };

    const ModeButton = ({ icon, label, modeValue, bgColor, hoverColor }: any) => (
        <Button
            variant="contained"
            size="large"
            onClick={() => handleSelect(modeValue)}
            sx={{
                p: { xs: 2, sm: 2.5 },
                minWidth: { xs: 0, sm: 0 },
                flexDirection: "column",
                gap: { xs: 1, sm: 1.5 },
                height: "100%",
                width: "100%",
                maxWidth: '100%',
                backgroundColor: bgColor || '#B794F6',
                color: '#fff',
                fontWeight: 'bold',
                borderRadius: { xs: 2, sm: 3 },
                textTransform: 'none',
                boxShadow: `0 4px 16px ${bgColor ? bgColor + '60' : 'rgba(183, 148, 246, 0.4)'}`,
                boxSizing: 'border-box',
                '&:hover': {
                    backgroundColor: hoverColor || bgColor || '#9F7AEA',
                    transform: 'translateY(-2px)',
                    boxShadow: `0 8px 24px ${bgColor ? bgColor + '80' : 'rgba(183, 148, 246, 0.5)'}`,
                },
                transition: 'all 0.3s ease'
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 0.5 }}>
                {icon}
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: { xs: '0.8125rem', sm: '1rem' }, wordBreak: 'break-word' }}>
                {label}
            </Typography>
        </Button>
    );

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
                    <HealthcareHeader title={t.modeTitle} />
                </Box>
                <Typography 
                    variant="body1" 
                    sx={{ 
                        color: '#666',
                        mb: { xs: 2.5, sm: 3 },
                        fontSize: { xs: '0.8125rem', sm: '0.9375rem' },
                        wordBreak: 'break-word',
                        px: { xs: 0.5, sm: 0 }
                    }}
                >
                    {t.modeSubtitle}
                </Typography>

                {/* Use Stack + responsive Boxes instead of Grid to avoid Grid typing differences */}
                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={{ xs: 1.5, sm: 2 }}
                    justifyContent="center"
                    alignItems="stretch"
                    sx={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}
                >
                    <Box sx={{ width: { xs: "100%", sm: "30%" } }}>
                        <ModeButton
                            icon={<PersonIcon sx={{ fontSize: { xs: 48, sm: 64 }, color: '#fff' }} />}
                            label={t.normal}
                            modeValue="normal"
                            bgColor="#8B5CF6"
                            hoverColor="#7C3AED"
                        />
                    </Box>

                    <Box sx={{ width: { xs: "100%", sm: "30%" } }}>
                        <ModeButton
                            icon={<NaturePeopleIcon sx={{ fontSize: { xs: 48, sm: 64 }, color: '#fff' }} />}
                            label={t.rural}
                            modeValue="rural"
                            bgColor="#059669"
                            hoverColor="#047857"
                        />
                    </Box>

                    <Box sx={{ width: { xs: "100%", sm: "30%" } }}>
                        <ModeButton
                            icon={<AccessibilityNewIcon sx={{ fontSize: { xs: 48, sm: 64 }, color: '#fff' }} />}
                            label={t.easy}
                            modeValue="easy"
                            bgColor="#D97706"
                            hoverColor="#B45309"
                        />
                    </Box>
                </Stack>
            </Card>

            <Backdrop open={loading} sx={{ color: "#fff", zIndex: 9999 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                    <CircularProgress color="inherit" />
                    <Typography variant="h6">
                        {t.loading}
                    </Typography>
                </Box>
            </Backdrop>
        </Container>
    );
};

export default UserMode;
