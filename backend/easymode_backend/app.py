# app_backend.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import time
import json

app = Flask(__name__)
# Enable CORS to allow your React app (default: localhost:3000) to communicate with Flask (localhost:5000)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

# --- In-Memory Data Store ---
# This dictionary simulates a database or session store for one user.
app_data_store = {
    "user_id": 12345,

    "appointment": {
        "date": "10/12/2025",
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
        # Primary contact is copied from profile for consistency
        "primaryContact": "CHIN YEE (012-3456789)", 
    },
    
    # 3. Medicine Data (Simulating a persistent record)
    "medicine": {
        # Full mock data for the MedicineReminder page
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
    "transport_need": None, # Stores 'wheelchair', 'bedridden', or custom text
    "transport_booked_time": None,
}
# -----------------------------

@app.route('/api/get_all_data', methods=['GET'])
def get_all_data():
    """
    Simulates fetching all initial user and medical data from the centralized government base.
    """
    # Ensure Emergency contact is synced with current Profile data before returning
    app_data_store['emergency']['primaryContact'] = app_data_store['profile']['emergency_contact']
    
    return jsonify({
        "status": "success",
        "user_data": app_data_store
    }), 200

# -----------------
# 1. Profile Endpoints
# -----------------

@app.route('/api/update_emergency_contact', methods=['POST'])
def update_emergency_contact():
    """Updates the user's emergency contact in the store."""
    try:
        data = request.json
        new_contact = data.get('new_contact')
        
        if new_contact:
            # Update the profile and emergency data fields
            app_data_store['profile']['emergency_contact'] = new_contact
            app_data_store['emergency']['primaryContact'] = new_contact
            
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
# 2. Transport Endpoints
# -----------------

@app.route('/api/set_transport', methods=['POST'])
def set_transport():
    """Receives and stores the transport need from the AppointmentFlow page (simulating sending data to central base)."""
    try:
        data = request.json
        transport_need = data.get('transport_need')
        
        if transport_need:
            app_data_store['transport_need'] = transport_need
            app_data_store['transport_booked_time'] = time.time()
            print(f"Backend stored transport need: {transport_need}")
            
            return jsonify({"status": "success", "message": "Transport need updated."}), 200
        else:
            return jsonify({"status": "error", "message": "Missing transport_need field."}), 400
            
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/api/get_transport', methods=['GET'])
def get_transport():
    """Returns the current transport status and mock driver details for the TransportStatus page."""
    current_need = app_data_store['transport_need']
    
    if current_need:
        # Mock Driver Data (Simulates service response)
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
    app_data_store['transport_need'] = None
    app_data_store['transport_booked_time'] = None
    print("Backend cleared current transport booking.")
    
    return jsonify({"status": "cleared", "message": "Transport booking has been cleared."}), 200

# -----------------
# 3. Medicine Endpoints
# -----------------

@app.route('/api/confirm_medicine_taken', methods=['POST'])
def confirm_medicine_taken():
    """Updates the timestamp of the last medicine taken."""
    app_data_store['last_taken_medicine'] = time.time()
    print(f"Backend updated last taken medicine time: {app_data_store['last_taken_medicine']}")
    
    return jsonify({"status": "success", "message": "Medicine taken confirmed."}), 200


if __name__ == '__main__':
    print("Starting Flask API server on http://localhost:5000")
    app.run(port=5000, debug=True)