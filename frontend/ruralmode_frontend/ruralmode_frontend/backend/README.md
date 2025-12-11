# Geospatial Classification Backend

This Flask backend classifies user locations as rural or urban using geospatial data.

## Setup

1. **Install Python dependencies:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

2. **Install GDAL (required for rasterio):**
   - macOS: `brew install gdal`
   - Ubuntu: `sudo apt-get install gdal-bin libgdal-dev`
   - Windows: Download from https://www.lfd.uci.edu/~gohlke/pythonlibs/#gdal

3. **Add Geospatial Data (Optional):**
   - Download GHSL or GPW data files
   - Place them in the `backend/data/` directory
   - Update paths in `app.py` if using different files

4. **Run the server:**
```bash
python app.py
```

The API will be available at `http://localhost:5000`

## API Endpoints

### POST /classify-location
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

### POST /classify-batch
Classify multiple locations at once.

### GET /health
Health check endpoint.

## Classification Methods

1. **Rasterio** (Most accurate): Uses GHSL/GPW raster data if available
2. **GeoPandas** (Accurate): Uses OSM boundary shapefiles if available
3. **Heuristic** (Fallback): Uses Malaysian state/region boundaries

## Notes

- The heuristic method works without any data files
- For production, download actual GHSL or GPW data for Malaysia
- Adjust `RURAL_POPULATION_THRESHOLD` based on DOSM standards

