# flask_data.py (Run this on port 5000)

from flask import Flask, request, jsonify
from flask_cors import CORS
import time
import json

app = Flask(__name__)
# Enable CORS to allow your React app (default: localhost:3000) to communicate with Flask (localhost:5000)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

# --- Configuration for the Test User IC ---
USER_IC_KEY = "990101145678" # Use the test IC from the FastAPI app

# --- In-Memory Data Store (Stores data per IC) ---
app_data_store = {
    USER_IC_KEY: {
        "user_id": 12345, 
        "ic_number": USER_IC_KEY, 

        "appointment": {
            "date": "Tuesday, 10 Dec 2025",
            "time": "10:00 AM"
        },
        
        # 1. Profile Data (Editable)
        "profile": {
            "name": "LIM CHIN WEI",
            "ic_number": "851020-07-5XXX",
            "dob": "20 / OCTOBER / 1985",
            "address": "NO. 12, JALAN SAGA, KUALA LUMPUR",
            "emergency_contact": "CHIN YEE (012-3456789)"
        },
        
        # 2. Emergency/Medical Data (Read-Only fields, updated from government base)
        "emergency": {
            "bloodType": "O POSITIVE",
            "allergies": "PENICILLIN, LATEX",
            "conditions": "TYPE 2 DIABETES, MILD ASTHMA",
            "medications": "METFORMIN (500mg, Daily)",
            "primaryContact": "CHIN YEE (012-3456789)", 
        },
        
        # 3. Medicine Data (Simulating a persistent record)
        "medicine": {
            "medicineName": "Blood Pressure Pill",
            "dosage": "5mg",
            "pillsRemaining": 10,
            "isRefillLow": True, 
            "courier": {
                "name": "Alex C.",
                "deliveryVehicle": "Bike Courier",
                "eta": "3 hours",
            },
        },
        
        # 4. Transport State (Editable/Session-based)
        "transport_need": None, 
        "transport_booked_time": None,
    }
}
# -----------------------------

def get_user_data(ic_number):
    """Helper to retrieve user data by clean IC number."""
    clean_ic = str(ic_number).replace("-", "").replace(" ", "").strip()
    return app_data_store.get(clean_ic)


@app.route('/api/get_all_data/<ic_number>', methods=['GET']) # <<< MODIFIED ROUTE
def get_all_data(ic_number):
    """Fetches all initial user and medical data for a specific IC."""
    user_data = get_user_data(ic_number)
    
    if not user_data:
        return jsonify({"status": "error", "message": f"User data not found for IC: {ic_number}"}), 404

    # Ensure emergency contact is synced
    user_data['emergency']['primaryContact'] = user_data['profile']['emergency_contact']
    
    return jsonify({
        "status": "success",
        "user_data": user_data
    }), 200

# -----------------
# 1. Appointment Endpoints (Updated to accept IC)
# -----------------

@app.route('/api/set_appointment/<ic_number>', methods=['POST'])
def set_appointment(ic_number):
    """Updates the user's appointment date and time."""
    try:
        user_data = get_user_data(ic_number)
        if not user_data:
            return jsonify({"status": "error", "message": "User not found."}), 404

        data = request.json
        new_date = data.get('date')
        new_time = data.get('time')
        
        if new_date and new_time:
            user_data['appointment']['date'] = new_date
            user_data['appointment']['time'] = new_time
            print(f"Backend updated appointment for {ic_number} to: {new_date} at {new_time}")
            
            return jsonify({"status": "success", "message": "Appointment date updated."}), 200
        else:
            return jsonify({"status": "error", "message": "Missing date or time fields."}), 400
            
    except Exception as e:
        print(f"Error updating appointment: {e}")
        return jsonify({"status": "error", "message": "Internal server error."}), 500

# -----------------
# 2. Profile Endpoints (Original logic is maintained for single user data for now)
# NOTE: For a real multi-user app, this should also be updated to accept <ic_number>
# -----------------

@app.route('/api/update_emergency_contact', methods=['POST'])
def update_emergency_contact():
    """Updates the user's emergency contact in the store."""
    try:
        # Assuming the request body must contain the IC number for multi-user, 
        # but maintaining original logic by updating the single test user's data.
        user_data = app_data_store.get(USER_IC_KEY)
        
        data = request.json
        new_contact = data.get('new_contact')
        
        if new_contact:
            user_data['profile']['emergency_contact'] = new_contact
            user_data['emergency']['primaryContact'] = new_contact
            
            print(f"Backend updated emergency contact: {new_contact}")
            
            return jsonify({
                "status": "success", 
                "message": "Emergency contact updated.",
                "new_contact": new_contact
            }), 200
        else:
            return jsonify({"status": "error", "message": "Missing new_contact field."}), 400
            
    except Exception as e:
        print(f"Error updating contact: {e}")
        return jsonify({"status": "error", "message": "Internal server error."}), 500

# -----------------
# 3. Transport Endpoints (Using the test user's data)
# -----------------

# NOTE: These endpoints should ideally also be updated with /<ic_number> if they are critical.
@app.route('/api/set_transport', methods=['POST'])
def set_transport():
    """Receives and stores the transport need."""
    # This logic still updates the hardcoded test user (USER_IC_KEY)
    user_data = app_data_store.get(USER_IC_KEY)
    try:
        data = request.json
        transport_need = data.get('transport_need')
        
        if transport_need:
            user_data['transport_need'] = transport_need
            user_data['transport_booked_time'] = time.time()
            print(f"Backend stored transport need: {transport_need}")
            
            return jsonify({"status": "success", "message": "Transport need updated."}), 200
        else:
            return jsonify({"status": "error", "message": "Missing transport_need field."}), 400
            
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/api/get_transport', methods=['GET'])
def get_transport():
    """Returns the current transport status and mock driver details."""
    user_data = app_data_store.get(USER_IC_KEY)
    current_need = user_data['transport_need']
    
    if current_need:
        # Mock Driver Data 
        mock_ride_data = {
            "driver_name": "Sarah K.",
            "vehicle_type": "Blue Minivan",
            "vehicle_color": "Blue",
            "vehicle_plate": "ABC 1234",
            "eta": "15 minutes" 
        }

        return jsonify({
            "status": "booked",
            "transport_need": current_need,
            "ride_data": mock_ride_data
        }), 200
    else:
        return jsonify({
            "status": "unbooked",
            "transport_need": None,
            "ride_data": None
        }), 200

@app.route('/api/clear_transport', methods=['POST'])
def clear_transport():
    """Resets the stored transport need when user clicks 'Change Need'."""
    user_data = app_data_store.get(USER_IC_KEY)
    user_data['transport_need'] = None
    user_data['transport_booked_time'] = None
    print("Backend cleared current transport booking.")
    
    return jsonify({"status": "cleared", "message": "Transport booking has been cleared."}), 200

# -----------------
# 4. Medicine Endpoints
# -----------------

@app.route('/api/confirm_medicine_taken', methods=['POST'])
def confirm_medicine_taken():
    """Updates the timestamp of the last medicine taken."""
    # This logic still updates the hardcoded test user (USER_IC_KEY)
    user_data = app_data_store.get(USER_IC_KEY)
    user_data['last_taken_medicine'] = time.time()
    print(f"Backend updated last taken medicine time: {user_data['last_taken_medicine']}")
    
    return jsonify({"status": "success", "message": "Medicine taken confirmed."}), 200


if __name__ == '__main__':
    print("Starting Flask API server on http://localhost:5000 (Debug off)")
    # 🛑 CHANGE debug=True to debug=False to prevent watchdog issues 🛑
    app.run(port=5000, debug=False)