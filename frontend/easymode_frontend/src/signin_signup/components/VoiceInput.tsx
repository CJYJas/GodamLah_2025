import React, { useState } from 'react';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import { keyframes } from '@emotion/react';

// Pulse Animation
const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(255, 0, 0, 0.7); transform: scale(1); }
  70% { box-shadow: 0 0 0 10px rgba(255, 0, 0, 0); transform: scale(1.1); }
  100% { box-shadow: 0 0 0 0 rgba(255, 0, 0, 0); transform: scale(1); }
`;

interface VoiceInputProps {
    label: string;
    value: string;
    onChange: (val: string) => void;
    type?: string;
}

const VoiceInput: React.FC<VoiceInputProps> = ({ label, value, onChange, type = "text" }) => {
    const [isListening, setIsListening] = useState(false);

    const startListening = () => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Browser does not support voice.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.start();
        setIsListening(true);

        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            const cleanText = transcript.replace(/\s/g, ''); // Remove spaces for IC
            onChange(cleanText);
            setIsListening(false);
        };

        recognition.onend = () => setIsListening(false);
    };

    return (
        <TextField
            fullWidth
            type={type}
            label={label}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        <IconButton
                            onClick={startListening}
                            sx={{
                                animation: isListening ? `${pulse} 1.5s infinite` : 'none',
                                color: isListening ? 'red' : 'inherit',
                            }}
                        >
                            <MicIcon />
                        </IconButton>
                    </InputAdornment>
                ),
            }}
        />
    );
};

export default VoiceInput;