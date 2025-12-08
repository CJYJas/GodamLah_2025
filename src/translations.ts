export const translations = {
    en: {
        // --- Common ---
        next: "Next",
        back: "Back",
        loading: "Loading...",
        process: "Process & Next",
        retake: "Retake",
        error: "Error",
        home: "Home",
        backToStart: "Back to Start",
        retry: "Retry",

        // --- Home Page ---
        welcome: "Welcome",
        signUpBtn: "Sign Up",
        signInBtn: "Sign In",
        toggleLabel: "Switch to Bahasa Malaysia",

        // --- SignIn ---
        loginTitle: "MyKad Login",
        icLabel: "IC Number",
        passwordLabel: "Password",
        loginBtn: "Login",
        registerNow: "Register Now",
        userNotFound: "User Not Found",
        userNotFoundDesc: "This IC Number does not exist. Would you like to register?",
        emergencyBtn: "Emergency",
        emergencyTitle: "Emergency Confirmation",
        emergencyDesc: "Are you sure you want to call 999?",
        yesCall: "Yes, Call",
        no: "No",
        voiceVerify: "Voice Verification",
        sayName: "Please say your name clearly.",
        securityCheck: "Security Check",
        yourAnswer: "Your Answer",

        // --- SignUp Step 1 (Scan) ---
        scanTitle: "Scan MyKad",
        captureFront: "Capture Front",
        captureBack: "Capture Back",
        frontCaptured: "Front IC Captured",
        backCaptured: "Back IC Captured",
        captureError: "Please capture both sides",

        // --- SignUp Step 2 (Confirm) ---
        confirmTitle: "Confirm Your Info",
        fullName: "Full Name",
        address: "Address",
        confirmSubmit: "Confirm & Submit",

        // --- Voice ---
        voiceTitle: "Record Your Voice",
        readAloud: "Please read the following aloud:",
        voiceSentence: (name: string, ic: string) => `My name is ${name}, and I verify that my IC number is ${ic}.`,
        startRecord: "Tap to Record",
        listening: "Listening...",

        // --- Security ---
        securityTitle: "Security Setup",
        securityDesc: "Choose 2 questions to secure your account.",
        q1Label: "Security Question 1",
        a1Label: "Answer 1",
        q2Label: "Security Question 2",
        a2Label: "Answer 2",
        questions: [
            "What is your mother's maiden name?",
            "What is the name of your first pet?",
            "What was the name of your elementary school?",
            "What city were you born in?"
        ],

        // --- User Mode (Final Step) ---
        modeTitle: "Select User Mode",
        modeSubtitle: "Select the interface that suits you, then complete registration.",
        normal: "Normal Mode",
        rural: "Rural Mode",
        easy: "Easy Mode",
        completeBtn: "Complete Registration",
        successTitle: "Registration Successful!",
        successDesc: "Your account has been created. You can now log in.",
        loginNow: "Login Now"
    },
    bm: {
        // --- Common ---
        next: "Seterusnya",
        back: "Kembali",
        loading: "Memproses...",
        process: "Proses & Lanjut",
        retake: "Tangkap Semula",
        error: "Ralat",
        home: "Laman Utama",
        backToStart: "Kembali ke Mula",
        retry: "Cuba Lagi",

        // --- Home Page ---
        welcome: "Selamat Datang",
        signUpBtn: "Daftar",
        signInBtn: "Log Masuk",
        toggleLabel: "Tukar ke English",

        // --- SignIn ---
        loginTitle: "Log Masuk MyKad",
        icLabel: "Nombor KP",
        passwordLabel: "Kata Laluan",
        loginBtn: "Log Masuk",
        registerNow: "Daftar Sekarang",
        userNotFound: "Pengguna Tidak Ditemui",
        userNotFoundDesc: "Nombor KP ini tiada dalam sistem. Adakah anda ingin mendaftar?",
        emergencyBtn: "Kecemasan",
        emergencyTitle: "Pengesahan Kecemasan",
        emergencyDesc: "Adakah anda pasti mahu menghubungi 999?",
        yesCall: "Ya, Panggil",
        no: "Tidak",
        voiceVerify: "Pengesahan Suara",
        sayName: "Sila sebut nama anda dengan jelas.",
        securityCheck: "Semakan Keselamatan",
        yourAnswer: "Jawapan Anda",

        // --- SignUp Step 1 (Scan) ---
        scanTitle: "Imbas MyKad",
        captureFront: "Tangkap Depan",
        captureBack: "Tangkap Belakang",
        frontCaptured: "Gambar Depan Diambil",
        backCaptured: "Gambar Belakang Diambil",
        captureError: "Sila tangkap kedua-dua belah",

        // --- SignUp Step 2 (Confirm) ---
        confirmTitle: "Sahkan Maklumat",
        fullName: "Nama Penuh",
        address: "Alamat",
        confirmSubmit: "Sahkan & Hantar",

        // --- Voice ---
        voiceTitle: "Rekod Suara Anda",
        readAloud: "Sila baca ayat berikut dengan kuat:",
        voiceSentence: (name: string, ic: string) => `Nama saya ${name}, dan saya sahkan nombor kad pengenalan saya ialah ${ic}.`,
        startRecord: "Tekan untuk Rekod",
        listening: "Mendengar...",

        // --- Security ---
        securityTitle: "Tetapan Keselamatan",
        securityDesc: "Pilih 2 soalan untuk keselamatan akaun anda.",
        q1Label: "Soalan Keselamatan 1",
        a1Label: "Jawapan 1",
        q2Label: "Soalan Keselamatan 2",
        a2Label: "Jawapan 2",
        questions: [
            "Apakah nama ibu kandung anda?",
            "Apakah nama haiwan peliharaan pertama anda?",
            "Apakah nama sekolah rendah anda?",
            "Di manakah bandar kelahiran anda?"
        ],

        // --- User Mode (Final Step) ---
        modeTitle: "Pilih Mod Pengguna",
        modeSubtitle: "Pilih antaramuka yang sesuai, kemudian selesai pendaftaran.",
        normal: "Mod Biasa",
        rural: "Mod Luar Bandar",
        easy: "Mod Senang",
        completeBtn: "Selesai Pendaftaran",
        successTitle: "Pendaftaran Berjaya!",
        successDesc: "Akaun anda telah dicipta. Anda boleh log masuk sekarang.",
        loginNow: "Log Masuk Sekarang"
    }
};