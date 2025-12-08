import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Typography, TextField, Button, Box, Paper } from '@mui/material';
import axios from 'axios';
import { useLanguage } from '../context/LanguageContext'; // ✅ Import Translation Hook

const SignUpStep2: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { t } = useLanguage(); // ✅ Get Translations

    const initialData = location.state || {};

    const [fullName, setFullName] = useState(initialData.fullName || '');
    const [icNumber, setIcNumber] = useState(initialData.icNumber || '');
    const [address, setAddress] = useState(initialData.address || '');
    const [loading, setLoading] = useState(false);

    // Helper: convert base64 to Blob
    const dataURLtoBlob = (dataurl: string | null | undefined) => {
        if (!dataurl) return null;
        try {
            const arr = dataurl.split(',');
            const mimeMatch = arr[0].match(/:(.*?);/);
            if (!mimeMatch) return null;

            const mime = mimeMatch[1];
            const bstr = atob(arr[1]);
            let n = bstr.length;
            const u8arr = new Uint8Array(n);
            while (n--) u8arr[n] = bstr.charCodeAt(n);
            return new Blob([u8arr], { type: mime });
        } catch (e) {
            console.error("Error converting image:", e);
            return null;
        }
    };

    const handleSubmit = async () => {
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("full_name", fullName);
            formData.append("ic_number", icNumber);
            formData.append("address", address);

            const frontBlob = dataURLtoBlob(initialData.frontImage);
            if (frontBlob) formData.append("front_image", frontBlob);

            const backBlob = dataURLtoBlob(initialData.backImage);
            if (backBlob) formData.append("back_image", backBlob);

            // Backend call
            await axios.post("http://localhost:8000/signup/confirm", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

        } catch (err) {
            console.error("Backend error:", err);
        } finally {
            setLoading(false);

            // Navigate to next step regardless of backend success/failure
            navigate("/signup-voice", {
                state: {
                    fullName,
                    icNumber,
                    address,
                    // Keep original images in state just in case
                    frontImage: initialData.frontImage,
                    backImage: initialData.backImage
                }
            });
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 5 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    {t.confirmTitle} {/* "Confirm Your Info" */}
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 3 }}>
                    <TextField
                        label={t.fullName} // "Full Name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                    />

                    <TextField
                        label={t.icLabel} // "IC Number"
                        value={icNumber}
                        onChange={(e) => setIcNumber(e.target.value)}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                    />

                    <TextField
                        label={t.address} // "Address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        fullWidth
                        multiline
                        rows={3}
                        InputLabelProps={{ shrink: true }}
                    />

                    <Button
                        variant="contained"
                        size="large"
                        onClick={handleSubmit}
                        sx={{ mt: 3 }}
                        disabled={loading}
                    >
                        {loading ? t.loading : t.next} {/* "Loading..." or "Next" */}
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default SignUpStep2;