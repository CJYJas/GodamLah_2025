// App.tsx (UPDATED with correct paths based on your file structure)

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Box } from "@mui/material";
// Assuming LanguageContext is in './signin_signup/context'
import { LanguageProvider } from "./signin_signup/context/LanguageContext"; 
// All page components are inside 'signin_signup/pages'
import Home from "./signin_signup/pages/Home";
import SignUpStep1 from "./signin_signup/pages/SignUpStep1";
import SignUpStep2 from "./signin_signup/pages/SignUpStep2";
import SignUpVoice from "./signin_signup/pages/SignUpVoice";
import SignUpSecurity from "./signin_signup/pages/SignUpSecurity";
import UserMode from './signin_signup/pages/UserMode';
import SignIn from "./signin_signup/pages/SignIn";
import Emergency from "./signin_signup/pages/Emergency";

function App() {
  return (
    <LanguageProvider>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          backgroundColor: '#1a1a1a',
          py: { xs: 0, sm: 3 },
          px: { xs: 0, sm: 2 }
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: { xs: '100%', sm: '428px' },
            height: { xs: '100vh', sm: '926px' },
            maxHeight: { xs: '100vh', sm: '926px' },
            backgroundColor: '#fff',
            borderRadius: { xs: 0, sm: '40px' },
            border: { xs: 'none', sm: '8px solid #1a1a1a' },
            boxShadow: { xs: 'none', sm: '0 0 0 2px #333, 0 20px 60px rgba(0, 0, 0, 0.3)' },
            overflow: 'hidden',
            position: 'relative',
            margin: { xs: 0, sm: 'auto' },
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              width: { xs: 0, sm: '150px' },
              height: { xs: 0, sm: '25px' },
              backgroundColor: '#1a1a1a',
              borderBottomLeftRadius: { xs: 0, sm: '20px' },
              borderBottomRightRadius: { xs: 0, sm: '20px' },
              zIndex: 1000,
              display: { xs: 'none', sm: 'block' }
            }
          }}
        >
            <Box
              className="phone-content"
              sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                overflowY: 'auto',
                overflowX: 'hidden',
                background: 'linear-gradient(135deg, #F5F0FF 0%, #E8D5FF 100%)',
                position: 'relative',
                paddingTop: { xs: 0, sm: '25px' },
                paddingBottom: { xs: 0, sm: '20px' },
                '&::-webkit-scrollbar': {
                  width: '4px'
                },
                '&::-webkit-scrollbar-track': {
                  background: 'transparent'
                },
                '&::-webkit-scrollbar-thumb': {
                  background: '#B794F6',
                  borderRadius: '2px'
                }
              }}
            >
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Router>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/signup-step1" element={<SignUpStep1 />} />
                    <Route path="/signup-step2" element={<SignUpStep2 />} />
                    <Route path="/signup-voice" element={<SignUpVoice />} />
                    <Route path="/signup-security" element={<SignUpSecurity />} />
                    {/* The main application logic is now nested here */}
                    <Route path="/emergency" element={<Emergency />} />
                    <Route path="/signin" element={<SignIn />} />
                    <Route path="/user-mode" element={<UserMode />} />
                  </Routes>
                </Router>
              </Box>
              {/* Home Indicator */}
              <Box
                sx={{
                  width: { xs: 0, sm: '134px' },
                  height: { xs: 0, sm: '5px' },
                  backgroundColor: '#1a1a1a',
                  borderRadius: { xs: 0, sm: '3px' },
                  display: { xs: 'none', sm: 'block' },
                  margin: { xs: 0, sm: '8px auto' },
                  flexShrink: 0
                }}
              />
            </Box>
        </Box>
      </Box>
    </LanguageProvider>
  );
}

export default App;
