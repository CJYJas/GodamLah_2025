<<<<<<< HEAD
# setupPage
This is a project to design the login and logout page for Hackathon 2.0
=======
# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser# 🚀 MyHealth | Inclusive Government Healthcare Super-App

**🔗 Live Demo/Prototype:** [myhealth-godamlah20.vercel.app/#cta](https://myhealth-godamlah20.vercel.app/#cta)

**MyHealth: Malaysia's all-in-one, inclusive government healthcare app.**

We merge MySejahtera + MyUbat into a unified super-app with adaptive modes, offline resilience, voice authentication, and IC-linked health records synced nationwide.

| Authentication | Data Linkage | Accessibility | Security |
| :--- | :--- | :--- | :--- |
| Voice Auth | IC-Linked | Offline Ready | Secure |

---

## 💡 The Problem: Why Malaysia Needs MyHealth

| Statistic | Description |
| :--- | :--- |
| **6.6M** | B40 Households (~20% of population) |
| **600K+** | OKU Registered (Persons with Disabilities) |
| **3.5M** | Elderly (60+), growing annually |
| **30%** | Rural Population (Limited connectivity) |

### 1. Fragmented Apps
MySejahtera, MyUbat, and other government health apps operate in silos. Users must manage multiple accounts, learn different interfaces, and manually transfer information, leading to multiple logins, data silos, and no integration.

### 2. Marginalized Groups
Elderly, OKU (disabled persons), rural communities, and B40 households face digital barriers. Current apps lack accessibility features, offline support, and simplified interfaces (No VoiceOver, Complex UIs, Online-only).

### 3. ICs Cannot Sync Data
Health data cannot sync nationwide across clinics and hospitals. When citizens visit different facilities, their medical history, prescriptions, and test results don't follow them, resulting in no portability, duplicate tests, and lost records.

---

## ✅ Our Solution: MyHealth Unified Super-App

| Solution | Description |
| :--- | :--- |
| **Unified App** | Combine MySejahtera + MyUbat into one super-app. Single login, single dashboard, all your health needs in one place. |
| **Adaptive Modes** | Three specialized modes: Easy (VoiceOver, large text, voice auth), Normal (fast workflows), Rural (offline + home visit support). |
| **Future IC Sync** | Nationwide health record spine linked to IC. Your verified medical data follows you to any clinic or hospital in Malaysia. |

---

## 🔑 Adaptive Modes: Personalized experience for every user


### 1. Elderly / Easy Mode
For seniors and users needing accessibility.

* **Full VoiceOver Support:** Screen reader compatible with Bahasa Malaysia and English.
* **Extra Large Text and Buttons:** Minimum 18px fonts, large tap targets ($48\text{x}48\text{px}$ minimum).
* **Voice Recognition Login:** Replace password with voice authentication for easier access.
* **High Contrast Theme:** WCAG AAA compliant colors, dyslexia-friendly fonts.
* **Powered by iPhone's Built-in VoiceOver:** Leverages native accessibility features for the most reliable solution.

### 2. Normal Mode
Fast, efficient workflows for everyday users.

* **Unified Dashboard:** All health data, appointments, medications in one view.
* **2-Tap Actions:** Book appointments and refill medications in just 2 taps.
* **Smart Notifications:** Personalized reminders for appointments and medications.
* **Voice Recognition Login:** Secure voice authentication - no passwords to remember.

### 3. Rural Mode
For areas with limited connectivity.

* **Offline-First Architecture:** Full functionality without internet, syncs when connected.
* **Home Visit Support:** Healthcare agents can serve patients at home with a mobile app.
* **Low-Bandwidth Optimization:** Compressed assets, minimal data usage (under $1\text{MB}$/session).
* **Local Data Cache:** Encrypted SQLite stores critical health data locally.

---

## 🏥 Public Kiosk Mode (Unique Differentiator)

### IC + Voice = Instant Access
Our system can be deployed on public kiosks in hospitals, clinics, and government offices. Users simply insert their IC (MyKad) and use voice recognition to authenticate - **no smartphone or password required.**

* **Step 1:** Insert MyKad (Kiosk reads IC chip and retrieves your profile).
* **Step 2:** Voice Authentication (Speak a simple phrase to verify your identity).
* **Step 3:** Access Healthcare (View records, book appointments, refill medications).

This ensures **Zero Learning** and is **100% Inclusive** for the elderly, disabled, and users without smartphones, while remaining **Secure by Design** (IC chip + voice recognition = strong two-factor authentication).

---

## 🛠️ Tech Stack: Modern, scalable, and secure


| Component | Key Technologies | Description |
| :--- | :--- | :--- |
| **Frontend / UI** | Next.js (App Router), TypeScript, Tailwind CSS, React Native (Mobile) |
| **Local Database (Edge)** | SQLite (Encrypted), Offline-first cache, Local Hash Chain | **CRITICAL for Offline Mode** |
| **Central Database** | PostgreSQL, Supabase / Neon, Eligibility Ledger, Permanent Audit Log | **Source of Truth** |
| **Identity Capture** | WebRTC, OCR (Tesseract.js), Voice Recognition, IC Chip Reader | |

---

## ⚙️ How to Run the Prototype

Our project is divided into distinct components for presentation and demonstration.

### Part 1: Full-Stack Demo (Sign-up, Sign-in, and Easy Mode)

These components are fully integrated with working backend logic.

| Component | Location | Command |
| :--- | :--- | :--- |
| **Frontend (Easy Mode)** | `frontend/easymode` | `npm start` |
| **Backend (Easy Mode Logic)** | `backend/easymode` | `python app.py` |
| **Backend (Sign-in/Sign-up)** | `backend/signinsignup` | `python main.py` |

### Part 2: Frontend Prototypes (Normal & Rural Mode)

These components are prototypes showcasing the unique UI/UX designs for our accessibility track.

* **Normal Mode Prototype**
* **Rural Mode Prototype**

| Location | Command |
| :--- | :--- |
| **Frontend Root** |  `npm start dev` |

---

## 🚀 Future Plans & Expected Impact

### Expected Impact
* **Centralization of Healthcare Data:** One unified health record per citizen, accessible from any healthcare facility nationwide.
* **Zero Digital Exclusion:** Every Malaysian can access healthcare services regardless of age, disability, location, or smartphone ownership through adaptive modes and public kiosks.
* **Reducing Digital Friction:** Voice and IC authentication eliminates password barriers, making healthcare access as simple as speaking your name.

### Future Plans
* **Contextual Smart Mode Switching (Coming Soon):** The app will automatically detect context (location, time of day, user behavior) and switch modes accordingly (e.g., enter a rural clinic? Offline mode activates. Using a kiosk? Easy mode appears).
* **Predictive Adaptivity (Roadmap):** AI-powered predictions for medication refills, appointment suggestions based on health patterns, and proactive health alerts. The system learns user preferences and adapts the interface dynamically.

---

## 👤 Team

| Name | Role / Focus |
| :--- | :--- |
| **Jasmine Chin Jia Yee** | Team Lead / Easy Mode Development |
| **Josephine Ding Jie Yu** | UI Design / Normal Mode Prototype Development |
| **Ng Shao Ern** | Rural Mode Prototype Development |
| **Ng Geok Liu** | Sign In / Sign Up Backend & Logic |
| **Wong Zixin** | Sign In / Sign Up Frontend & Integration |

**MyHealth is ready to bring inclusive, unified healthcare to every Malaysian. Let's build a healthier, more connected future together.**

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
>>>>>>> 81051b2 (Initial commit)
