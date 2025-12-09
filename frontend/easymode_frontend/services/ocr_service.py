import re

# ---------------------------------------------------------
# MOCK OCR SERVICE (Use this if Tesseract is failing)
# This pretends to scan the ID so you can test the App Flow.
# ---------------------------------------------------------


def extract_details(image_bytes):
    print("⚠️ RUNNING IN MOCK MODE: Skipping actual OCR to avoid crash.")

    # We simply return a success response with dummy data.
    # This allows your Frontend to move to Step 2 immediately.
    return {
        "success": True,
        "icNumber": "990101-12-1234",  # Dummy IC
        "fullName": "ALI BIN ABU",     # Dummy Name
        "address": "NO 1, JALAN TEST, KUALA LUMPUR"
    }

# ---------------------------------------------------------
# KEEP THE REAL CODE BELOW FOR LATER (COMMENTED OUT)
# ---------------------------------------------------------
# import cv2
# import numpy as np
# import pytesseract
# ... (Real logic is hidden to prevent crashes)
