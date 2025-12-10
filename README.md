# 🚀 NextG GodamLah 2.0: Smart ID - HEALTHCARE PRO

## ✨ Project Summary

In the era of rapid digital transformation, access to essential health services is often fragmented across multiple applications and limited by technological barriers. The **Smart ID** application aims to **unify** existing medical health services into a single, intuitive platform, while critically addressing issues of **digital inclusivity** and **accessibility** for all segments of society, regardless of age or location.

Our core innovation is leveraging the national Identity Card (IC) as a universal, secure key to personal and medical data, streamlining the entire healthcare process.

## 💡 The Problem & Our Solution

| Problem | Smart ID Solution |
| :--- | :--- |
| **Fragmented Health Data:** Users must navigate multiple apps for appointments, records, and prescriptions. | **All-in-One Integration:** Consolidates all personal medical records, appointment booking, and health services into a single, comprehensive interface. |
| **Access/Inclusivity Barriers:** Old people, those with poor connectivity, or those unfamiliar with complex apps struggle to access services. | **Three Specialized Modes:** Normal, Easy, and Rural modes cater the experience to the user's need. |
| **Password/Login Difficulty:** Users forget passwords, leading to friction and security risks. | **Effortless & Secure Authentication:** Uses **Voice Recognition** for login and IC Card scanning for hassle-free sign-up. |

## 🔑 Key Features & Inclusivity Track Focus

### 1. Seamless Onboarding & Authentication

* **Voice Recognition Login:** Users can log in using their unique voiceprint, eliminating the need to remember complex passwords.
* **IC Snap Sign-Up:** Users simply snap a photo of their IC during sign-up. The app uses OCR to securely extract necessary personal information, simplifying the initial registration process.

### 2. Centralized Data Access (Future State)

* **Assumption:** We assume that in the future, the national IC number will be connected to a government central database.
* **Functionality:** Upon successful authentication, all personal information and consolidated medical records will be securely obtained from this central database, ensuring up-to-date and accurate data.

### 3. Inclusivity (Our Track Focus: Accessibility)

To ensure that *everyone* can benefit, the app offers three distinct operational modes:

| Mode | Target User | Key Accessibility Features |
| :--- | :--- | :--- |
| **Normal Mode** | Tech-savvy users, urban areas. | The default, fully integrated, feature-rich interface. |
| **Easy Mode** | Older adults, visually impaired users. | **Large Fonts and Icons**, high-contrast colors, and a **Button-centric** interface to minimize typing. |
| **Rural Mode** | Users in remote areas with limited infrastructure. | **Specialized Transport Options** (e.g., boat, helicopter) for emergencies, and a **House Call Service** where medical staff can be dispatched directly to the user's home. |

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
| **Frontend Root** | `frontend` | `npm start dev` |

## 🛠️ Technology Stack

* **Frontend:** React
* **Backend:** Python (FastAPI, Uvicorn, Flask)
* **ML/Auth:** Librosa, NumPy, SciPy, OCR Library
* **Database:** JSON File Storage / (Future Government Integration)

## 👤 Team

| Name | Role / Focus |
| :--- | :--- |
| **Jasmine Chin Jia Yee** | Team Lead / Easy Mode Development |
| **Josephine Ding Jie Yu** | UI Design / Normal Mode Prototype Development |
| **Ng Shao Ern** | Rural Mode Prototype Development |
| **Ng Geok Liu** | Sign In / Sign Up Backend & Logic |
| **Wong Zixin** | Sign In / Sign Up Frontend & Integration |

## 🏆 What's Next (Future Vision)

* **PWA (Progressive Web App) Support:** Implement PWA features to allow users to **install the app directly from the web** and **use core functionalities offline** or in low-connectivity areas, ensuring high reliability for users in rural or remote locations.
* Integration with wearable fitness trackers.
* Telemedicine consultation features, optimized for low-bandwidth environments (Rural Mode).
* Integration of predictive health analytics based on historical data.

---

**Thank you for considering our project for the NextG GodamLah 2.0 Smart ID Hackathon!**
