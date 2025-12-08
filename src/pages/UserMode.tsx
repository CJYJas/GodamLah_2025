import React, { useState } from "react";
import {
    Box, Typography, Button, CircularProgress, Backdrop,
} from "@mui/material";
import Stack from "@mui/material/Stack";
import { useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import axios from "axios";

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
            await axios.post("http://localhost:8000/signup-finalize", finalData);
            alert(t.successTitle);
            navigate('/signin');
        } catch (error) {
            console.log("Offline mode logic...");
            setTimeout(() => {
                alert("Offline Mode: " + t.successTitle);
                navigate('/signin');
            }, 1000);
        } finally {
            setLoading(false);
        }
    };

    const ModeButton = ({ icon, label, modeValue, color }: any) => (
        <Button
            variant="contained"
            size="large"
            color={color || "primary"}
            startIcon={icon}
            onClick={() => handleSelect(modeValue)}
            sx={{
                p: 3,
                minWidth: 150,
                flexDirection: "column",
                gap: 1,
                height: "100%",
                width: "100%",
            }}
        >
            {label}
        </Button>
    );

    return (
        <Box textAlign="center" mt={5} px={2}>
            <Typography variant="h4" gutterBottom>
                {t.modeTitle}
            </Typography>

            <Typography variant="body1" color="textSecondary" mb={4}>
                {t.modeSubtitle}
            </Typography>

            {/* Use Stack + responsive Boxes instead of Grid to avoid Grid typing differences */}
            <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={3}
                justifyContent="center"
                alignItems="stretch"
            >
                <Box sx={{ width: { xs: "100%", sm: "30%" } }}>
                    <ModeButton
                        icon={<PersonIcon fontSize="large" />}
                        label={t.normal}
                        modeValue="normal"
                    />
                </Box>

                <Box sx={{ width: { xs: "100%", sm: "30%" } }}>
                    <ModeButton
                        icon={<NaturePeopleIcon fontSize="large" />}
                        label={t.rural}
                        modeValue="rural"
                        color="success"
                    />
                </Box>

                <Box sx={{ width: { xs: "100%", sm: "30%" } }}>
                    <ModeButton
                        icon={<AccessibilityNewIcon fontSize="large" />}
                        label={t.easy}
                        modeValue="easy"
                        color="warning"
                    />
                </Box>
            </Stack>

            <Box mt={5}>
                <Button
                    variant="outlined"
                    color="inherit"
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate(-1)}
                >
                    {t.back}
                </Button>
            </Box>

            <Backdrop open={loading} sx={{ color: "#fff", zIndex: 9999 }}>
                <CircularProgress color="inherit" />
                <Typography variant="h6" sx={{ ml: 2 }}>
                    {t.loading}
                </Typography>
            </Backdrop>
        </Box>
    );
};

export default UserMode;
