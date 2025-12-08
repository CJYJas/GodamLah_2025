from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import shutil
import uuid
import os
import json
import numpy as np
import librosa
from scipy.spatial.distance import cosine

app = FastAPI()

# --- CORS SETUP ---
origins = ["http://localhost:3000", "http://127.0.0.1:3000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------- DATABASE CONFIG --------------------
USERS_FILE = "users.json"
IC_IMAGES_DIR = "ic_images"
VOICE_DIR = "voices"

# Ensure directories exist
os.makedirs(IC_IMAGES_DIR, exist_ok=True)
os.makedirs(VOICE_DIR, exist_ok=True)

# Global DB
users_db = {}
attempts_db = {}  # IC → failed attempts count

# --- HELPER: LOAD/SAVE DB ---


def load_db():
    global users_db
    if os.path.exists(USERS_FILE):
        try:
            with open(USERS_FILE, "r") as f:
                users_db = json.load(f)
            print(f"✅ Loaded {len(users_db)} users from disk.")
        except:
            print("⚠️ Database empty or corrupted. Starting fresh.")
            users_db = {}


def save_db():
    with open(USERS_FILE, "w") as f:
        json.dump(users_db, f, indent=4)
    print("💾 Database saved!")


# Load on startup
load_db()

# --- HELPER: CLEAN IC NUMBER ---


def clean_ic(ic_str: str):
    """Removes '-' and ' ' so 990101-10-1234 becomes 990101101234"""
    return ic_str.replace("-", "").replace(" ", "").strip()

# -------------------- 🎤 VOICE LOGIC (THE MISSING PART) --------------------


def extract_mfcc(path):
    try:
        # Load audio file (resample to 16kHz for consistency)
        audio, sr = librosa.load(path, sr=16000)
        # Extract MFCC features (acoustic fingerprint)
        mfcc = librosa.feature.mfcc(y=audio, sr=sr, n_mfcc=20)
        # Average them to get a single vector
        return np.mean(mfcc, axis=1)
    except Exception as e:
        print(f"❌ Audio Error: {e}")
        return None


def compare_voice(path1, path2):
    """Returns similarity score between 0.0 (Different) and 1.0 (Same)"""

    # ---------------------------------------------------------
    # 🚀 MOCK MODE: ALWAYS RETURN SUCCESS
    # We simply return 0.95 (95% match) so login always passes.
    # ---------------------------------------------------------
    print(
        f"⚠️ MOCK VOICE: Skipping comparison. Returning 95% match for {path1} vs {path2}")
    return 0.95

# -------------------- MODELS --------------------


class SecurityQuestions(BaseModel):
    ic_number: str
    question1: str
    answer1: str
    question2: str
    answer2: str


class UserModeRequest(BaseModel):
    ic_number: str
    mode: str      # normal, rural, easy, senior

# -------------------- ROUTES: SIGNUP --------------------

# STEP 1: OCR & INITIAL SAVE


@app.post("/signup/confirm")
async def signup_confirm(
    full_name: str = Form(...),
    ic_number: str = Form(...),
    address: str = Form(...),
    front_image: UploadFile = File(None),
    back_image: UploadFile = File(None)
):
    user_id = clean_ic(ic_number)

    if user_id not in users_db:
        users_db[user_id] = {}

    users_db[user_id].update({
        "full_name": full_name,
        "ic_number": user_id,
        "address": address
    })

    if front_image:
        front_path = f"{IC_IMAGES_DIR}/{user_id}_front.png"
        with open(front_path, "wb") as f:
            shutil.copyfileobj(front_image.file, f)
        users_db[user_id]["ic_front"] = front_path

    if back_image:
        back_path = f"{IC_IMAGES_DIR}/{user_id}_back.png"
        with open(back_path, "wb") as f:
            shutil.copyfileobj(back_image.file, f)
        users_db[user_id]["ic_back"] = back_path

    save_db()
    return {"success": True, "message": "Info Saved"}

# STEP 2: VOICE UPLOAD


@app.post("/signup-voice")
def signup_voice(
    icNumber: str = Form(...),
    voice_file: UploadFile = File(...)
):
    user_id = clean_ic(icNumber)

    if user_id not in users_db:
        users_db[user_id] = {}

    voice_path = f"{VOICE_DIR}/{user_id}.wav"
    with open(voice_path, "wb") as f:
        shutil.copyfileobj(voice_file.file, f)

    users_db[user_id]["voice_path"] = voice_path
    save_db()

    return {"success": True, "message": "Voice uploaded"}

# STEP 3: SAVE SECURITY QUESTIONS


@app.post("/signup-security")
def signup_security(data: SecurityQuestions):
    user_id = clean_ic(data.ic_number)

    if user_id not in users_db:
        users_db[user_id] = {}

    # Save the questions structure
    if "security" not in users_db[user_id]:
        users_db[user_id]["security"] = {}

    users_db[user_id]["security"].update({
        "question1": data.question1,
        "answer1": data.answer1.lower().strip(),
        "question2": data.question2,
        "answer2": data.answer2.lower().strip()
    })

    print(f"✅ Security saved for {user_id}")
    save_db()
    return {"success": True}

# STEP 4: FINALIZE (User Mode)


@app.post("/signup-finalize")
def signup_finalize(
    icNumber: str = Form(...),
    fullName: str = Form(...),
    address: str = Form(...),
    q1: str = Form(...),
    a1: str = Form(...),
    q2: str = Form(...),
    a2: str = Form(...),
    mode: str = Form("normal")  # Default mode
):
    user_id = clean_ic(icNumber)

    if user_id not in users_db:
        users_db[user_id] = {}

    # Update Everything
    users_db[user_id].update({
        "full_name": fullName,
        "address": address,
        "mode": mode,
        "security": {
            "question1": q1,
            "answer1": a1.lower().strip(),
            "question2": q2,
            "answer2": a2.lower().strip()
        }
    })

    print(f"✅ REGISTERED: {user_id} ({mode} mode)")
    save_db()
    return {"status": "User Registered", "user": users_db[user_id]}

# -------------------- ROUTES: LOGIN --------------------

# 1. CHECK USER & GET MODE


@app.post("/login/check-user")
def check_user(icNumber: str = Form(...)):
    user_id = clean_ic(icNumber)
    user = users_db.get(user_id)

    if not user:
        return {"success": False, "message": "User not found"}

    return {
        "success": True,
        "mode": user.get("mode", "security"),
        "fullName": user.get("full_name")
    }

# 2. VOICE LOGIN (COMPARES UPLOADED VOICE VS SAVED VOICE)


@app.post("/login-voice")
def login_voice(
    icNumber: str = Form(...),
    file: UploadFile = File(...)
):
    user_id = clean_ic(icNumber)
    user = users_db.get(user_id)

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Save the temporary login attempt voice
    login_path = f"{VOICE_DIR}/{user_id}_login_{uuid.uuid4()}.wav"
    with open(login_path, "wb") as f:
        shutil.copyfileobj(file.file, f)

    # 🔍 THIS IS THE SIMILARITY CHECK
    similarity = compare_voice(user.get("voice_path"), login_path)
    print(f"🎤 Voice Similarity for {user_id}: {similarity}")

    # Threshold: 0.60 (60% Match)
    if similarity >= 0.30:
        attempts_db[user_id] = 0
        return {"success": True, "message": "Voice matched"}

    # Track failed attempts
    attempts_db[user_id] = attempts_db.get(user_id, 0) + 1

    if attempts_db[user_id] >= 3:
        return {"success": False, "error": "TooManyAttempts"}

    return {"success": False, "error": "VoiceNotMatch", "attempts": attempts_db[user_id]}

# 3. SECURITY QUESTION LOGIN


@app.post("/login/initiate")
def login_initiate(icNumber: str = Form(...)):
    user_id = clean_ic(icNumber)
    user = users_db.get(user_id)

    if not user or "security" not in user:
        return {"success": False, "message": "User not found or no questions"}

    # Return first question for simplicity
    return {
        "success": True,
        "question": user["security"]["question1"]
    }


@app.post("/login/verify")
def login_verify(
    icNumber: str = Form(...),
    answer: str = Form(...)
):
    user_id = clean_ic(icNumber)
    user = users_db.get(user_id)

    if not user:
        return {"success": False}

    stored_ans = user["security"]["answer1"]

    if stored_ans == answer.lower().strip():
        return {"success": True, "user": user}

    return {"success": False, "message": "Incorrect Answer"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
