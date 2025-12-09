// FILE: frontend/src/services/api.ts
import axios from 'axios';

// Ensure this matches your Python Backend URL
const API_URL = "http://localhost:8000";

export const checkUserExists = async (icNumber: string) => {
    const formData = new FormData();
    formData.append("icNumber", icNumber);
    try {
        const res = await axios.post(`${API_URL}/login/check-user`, formData);
        return res.data;
    } catch (err) {
        return { success: false, message: "Server connection error" };
    }
};

// 1. extractICData: Sends front/back images to Python OCR
export const extractICData = async (frontFile: File, backFile: File) => {
    const formData = new FormData();
    formData.append("front_image", frontFile);
    formData.append("back_image", backFile);

    // Matches the @app.post("/api/ocr/extract") in main.py
    const response = await axios.post(`${API_URL}/api/ocr/extract`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

// 2. signupUser: Sends final registration details
export const signupUser = async (formData: FormData) => {
    return await axios.post(`${API_URL}/signup-finalize`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
};

// 3. initiateLogin: Step 1 of login (Get Security Question)
export const initiateLogin = async (icNumber: string) => {
    const formData = new FormData();
    formData.append("icNumber", icNumber);
    try {
        const res = await axios.post(`${API_URL}/login/initiate`, formData);
        return res.data;
    } catch (err: any) {
        return { success: false, message: err.response?.data?.detail || "Error" };
    }
};

// 4. verifyLogin: Step 2 of login (Verify Answer)
export const verifyLogin = async (icNumber: string, question: string, answer: string) => {
    const formData = new FormData();
    formData.append("icNumber", icNumber);
    formData.append("question", question);
    formData.append("answer", answer);

    try {
        const res = await axios.post(`${API_URL}/login/verify`, formData);
        return res.data;
    } catch (err: any) {
        return { success: false, message: "Verification failed" };
    }
};