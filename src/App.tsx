import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./context/LanguageContext";
import Home from "./pages/Home";
import SignUpStep1 from "./pages/SignUpStep1";
import SignUpStep2 from "./pages/SignUpStep2";
import SignUpVoice from "./pages/SignUpVoice";
import SignUpSecurity from "./pages/SignUpSecurity";
import UserMode from "./pages/UserMode";
import SignIn from "./pages/SignIn";
import Emergency from './pages/Emergency';

function App() {
  return (
    <LanguageProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup-step1" element={<SignUpStep1 />} />
          <Route path="/signup-step2" element={<SignUpStep2 />} />
          <Route path="/signup-voice" element={<SignUpVoice />} />
          <Route path="/signup-security" element={<SignUpSecurity />} />
          <Route path="/user-mode" element={<UserMode />} />
          <Route path="/emergency" element={<Emergency />} />
          <Route path="/signin" element={<SignIn />} />
        </Routes>
      </Router>
    </LanguageProvider>
  );
}

export default App;
