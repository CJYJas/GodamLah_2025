import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
// 1. Import the hook
import { useLanguage } from "../context/LanguageContext";

const SignUpWizard: React.FC = () => {
    const navigate = useNavigate();

    // 2. THIS IS THE MISSING LINE causing your errors:
    const { language } = useLanguage();

    const [step, setStep] = useState(1);
    const [icNumber, setIcNumber] = useState("");
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");

    const handleNext = () => {
        setStep(step + 1);
    };

    return (
        <Box textAlign="center" mt={5}>
            <Typography variant="h4">
                {/* 3. Make sure to use lowercase "bm" to match your context */}
                {language === "bm" ? "Buat Akaun" : "Create Your Account"}
            </Typography>

            {step === 1 && (
                <Box mt={3}>
                    <TextField label="IC Number" value={icNumber} onChange={(e) => setIcNumber(e.target.value)} sx={{ mb: 2 }} />
                    <TextField
                        label={language === "bm" ? "Nama" : "Name"}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label={language === "bm" ? "Alamat" : "Address"}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                </Box>
            )}

            {step === 2 && (
                <Box mt={3}>
                    <Typography>
                        {language === "bm" ? "Rakam Suara Anda" : "Record Your Voice"}
                    </Typography>
                    {/* Add your real-time voice component here */}
                </Box>
            )}

            {step === 3 && (
                <Box mt={3}>
                    <Typography>
                        {language === "bm" ? "Soalan Keselamatan" : "Security Questions"}
                    </Typography>
                    {/* Security questions inputs here */}
                </Box>
            )}

            <Box mt={3}>
                <Button variant="contained" onClick={handleNext}>
                    {language === "bm" ? "Seterusnya" : "Next"}
                </Button>
            </Box>
        </Box>
    );
};

export default SignUpWizard;