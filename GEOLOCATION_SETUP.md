# Geospatial Classification Setup Guide

This guide explains how to set up the geospatial urban/rural classification system.

## Overview

The system automatically detects if a user is in a rural or urban area using:
1. **GPS coordinates** from the browser
2. **Flask backend** that classifies locations using geospatial data
3. **Auto-enables rural mode** if the user is detected in a rural area

## Setup Steps

### 1. Backend Setup (Python/Flask)

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

**Important:** You need to install GDAL system library first:
- **macOS**: `brew install gdal`
- **Ubuntu**: `sudo apt-get install gdal-bin libgdal-dev python3-gdal`
- **Windows**: Download from https://www.lfd.uci.edu/~gohlke/pythonlibs/#gdal

### 2. Run the Backend Server

```bash
# Make sure you're in the backend directory with venv activated
python app.py
```

The server will run on `http://localhost:5000`

### 3. Frontend Configuration

Create a `.env.local` file in the root directory:

```bash
NEXT_PUBLIC_API_URL=http://localhost:5000
```

For production, update this to your deployed backend URL.

### 4. Test the System

1. **Start the backend**: `cd backend && python app.py`
2. **Start the frontend**: `npm run dev`
3. **Open the app** in your browser
4. **Allow location access** when prompted
5. The app will automatically:
   - Get your GPS coordinates
   - Send them to the backend
   - Classify your location as rural/urban
   - Auto-enable rural mode if rural

## How It Works

### Classification Methods (in order of accuracy):

1. **Rasterio** (Most Accurate)
   - Uses GHSL or GPW population density raster files
   - Checks population density at your coordinates
   - Classifies as rural if density < 150 people/km²

2. **GeoPandas** (Accurate)
   - Uses OSM boundary shapefiles
   - Checks if coordinates fall within rural boundaries

3. **Heuristic** (Fallback)
   - Uses Malaysian state/region boundaries
   - Works without any data files
   - Currently implemented and working

### Adding Geospatial Data (Optional)

For more accurate classification, download and add:

1. **GHSL Data** (Global Human Settlement Layer):
   - Download from: https://ghsl.jrc.ec.europa.eu/
   - Place `.tif` files in `backend/data/`
   - Update path in `backend/app.py`

2. **GPW Data** (Gridded Population of the World):
   - Download from: https://sedac.ciesin.columbia.edu/data/collection/gpw-v4
   - Place `.tif` files in `backend/data/`
   - Update path in `backend/app.py`

3. **OSM Boundaries**:
   - Download Malaysia rural/urban boundaries
   - Place `.shp` files in `backend/data/`
   - Update code in `backend/app.py`

## API Endpoints

### POST `/classify-location`
Classify a single location.

**Request:**
```json
{
  "lat": 3.1390,
  "lon": 101.6869
}
```

**Response:**
```json
{
  "status": "urban",
  "method": "heuristic",
  "confidence": "high",
  "region": "kl"
}
```

### GET `/health`
Health check endpoint.

## Privacy & Permissions

- The app requests location permission on first load
- GPS coordinates are only sent to your backend (not to third parties)
- Classification result is stored locally
- User can manually override rural mode settings

## Troubleshooting

### Backend won't start
- Check if port 5000 is available
- Ensure all Python dependencies are installed
- Check GDAL installation

### Location not detected
- Check browser permissions (Settings > Privacy > Location)
- Ensure HTTPS in production (required for geolocation)
- Check browser console for errors

### Classification always returns "unknown"
- Check backend logs
- Verify API URL in `.env.local`
- Test backend directly: `curl http://localhost:5000/health`

## Production Deployment

1. **Backend**: Deploy Flask app using Gunicorn or similar
2. **Frontend**: Update `NEXT_PUBLIC_API_URL` to production backend URL
3. **HTTPS**: Required for geolocation API in production
4. **CORS**: Backend CORS is configured for localhost, update for production domain

## Current Status

✅ **Working Features:**
- Heuristic classification (no data files needed)
- GPS location detection
- Auto-enable rural mode
- Manual override available

⏳ **Optional Enhancements:**
- Add GHSL/GPW raster data for higher accuracy
- Add OSM boundary data
- Cache classification results
- Batch classification for multiple locations

