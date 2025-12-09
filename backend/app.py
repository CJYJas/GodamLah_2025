"""
Flask backend for geospatial urban/rural classification
Uses GHSL, GPW, or OSM data to classify user locations
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from pathlib import Path

app = Flask(__name__)
CORS(app)  # Enable CORS for Next.js frontend

# Configuration
DATA_DIR = Path(__file__).parent / "data"
GHSL_DATA_PATH = DATA_DIR / "GHS_SMOD_POP_GLOBE_R2019A_54009_1K_V1_0.tif"  # Example path
GPW_DATA_PATH = DATA_DIR / "gpw_v4_population_density_rev11_2020_30_sec.tif"  # Example path

# Thresholds (can be adjusted based on DOSM or other standards)
RURAL_POPULATION_THRESHOLD = 150  # people per km² (DOSM standard)
RURAL_DENSITY_THRESHOLD = 0.5  # for normalized density values


def classify_with_geopandas(lat: float, lon: float) -> dict:
    """
    Classify location using GeoPandas (for vector/OSM data)
    This is a placeholder - you would load actual OSM boundary data
    """
    try:
        import geopandas as gpd
        from shapely.geometry import Point
        
        # Example: Load OSM rural/urban boundaries
        # boundaries = gpd.read_file(DATA_DIR / "malaysia_rural_urban_boundaries.shp")
        # point = Point(lon, lat)
        # result = boundaries[boundaries.contains(point)]
        
        # For now, return a fallback classification
        return {
            "status": "unknown",
            "method": "geopandas",
            "message": "OSM boundary data not loaded"
        }
    except ImportError:
        return {"error": "geopandas not installed"}


def classify_with_rasterio(lat: float, lon: float) -> dict:
    """
    Classify location using Rasterio (for GHSL/GPW raster data)
    This checks the population density at the given coordinates
    """
    try:
        import rasterio
        from rasterio.warp import transform
        
        # Try GHSL data first
        if GPW_DATA_PATH.exists():
            data_path = GPW_DATA_PATH
        elif GHSL_DATA_PATH.exists():
            data_path = GHSL_DATA_PATH
        else:
            # Fallback: Use simple heuristic based on coordinates
            return classify_with_heuristic(lat, lon)
        
        with rasterio.open(data_path) as src:
            # Transform coordinates to the raster's CRS
            lon_transformed, lat_transformed = transform(
                'EPSG:4326',  # WGS84 (lat/lon)
                src.crs,
                [lon],
                [lat]
            )
            
            # Sample the raster at the transformed coordinates
            values = list(src.sample([(lon_transformed[0], lat_transformed[0])]))
            
            if values and len(values) > 0:
                density = float(values[0][0])
                
                # Classify based on population density
                is_rural = density < RURAL_POPULATION_THRESHOLD
                
                return {
                    "status": "rural" if is_rural else "urban",
                    "method": "rasterio",
                    "population_density": density,
                    "threshold": RURAL_POPULATION_THRESHOLD,
                    "confidence": "high" if density < 50 or density > 500 else "medium"
                }
        
        return classify_with_heuristic(lat, lon)
        
    except ImportError:
        return classify_with_heuristic(lat, lon)
    except Exception as e:
        return {
            "status": "error",
            "error": str(e),
            "fallback": classify_with_heuristic(lat, lon)
        }


def classify_with_heuristic(lat: float, lon: float) -> dict:
    """
    Fallback classification using Malaysian state/region heuristics
    This uses known rural areas in Malaysia (Sarawak, Sabah, interior regions)
    """
    # Malaysian rural regions (approximate boundaries)
    # Sarawak: 0.8°N to 5.0°N, 109.5°E to 115.5°E
    # Sabah: 4.0°N to 7.5°N, 115.0°E to 119.5°E
    # Interior Peninsular: 3.0°N to 6.0°N, 100.5°E to 102.5°E (less populated)
    
    is_sarawak = 0.8 <= lat <= 5.0 and 109.5 <= lon <= 115.5
    is_sabah = 4.0 <= lat <= 7.5 and 115.0 <= lon <= 119.5
    is_interior_peninsular = 3.0 <= lat <= 6.0 and 100.5 <= lon <= 102.5
    
    # Urban centers (high population density areas)
    # KL area: 3.0°N to 3.3°N, 101.5°E to 101.8°E
    # Penang: 5.2°N to 5.5°N, 100.2°E to 100.5°E
    # Johor Bahru: 1.4°N to 1.6°N, 103.6°E to 103.8°E
    
    is_kl = 3.0 <= lat <= 3.3 and 101.5 <= lon <= 101.8
    is_penang = 5.2 <= lat <= 5.5 and 100.2 <= lon <= 100.5
    is_johor_bahru = 1.4 <= lat <= 1.6 and 103.6 <= lon <= 103.8
    
    if is_kl or is_penang or is_johor_bahru:
        return {
            "status": "urban",
            "method": "heuristic",
            "region": "major_city",
            "confidence": "high"
        }
    elif is_sarawak or is_sabah:
        # Most of Sarawak and Sabah are rural except major cities
        # Check if near major cities
        is_kuching = 1.4 <= lat <= 1.6 and 110.2 <= lon <= 110.4
        is_kota_kinabalu = 5.9 <= lat <= 6.1 and 116.0 <= lon <= 116.2
        
        if is_kuching or is_kota_kinabalu:
            return {
                "status": "urban",
                "method": "heuristic",
                "region": "state_capital",
                "confidence": "medium"
            }
        else:
            return {
                "status": "rural",
                "method": "heuristic",
                "region": "sarawak_sabah" if is_sarawak else "sabah",
                "confidence": "high"
            }
    elif is_interior_peninsular:
        return {
            "status": "rural",
            "method": "heuristic",
            "region": "interior_peninsular",
            "confidence": "medium"
        }
    else:
        # Default: assume urban for peninsular Malaysia
        return {
            "status": "urban",
            "method": "heuristic",
            "region": "peninsular_malaysia",
            "confidence": "low"
        }


@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "service": "geospatial-classification"})


@app.route('/classify-location', methods=['POST'])
def classify_location():
    """
    Classify a location as rural or urban based on coordinates
    
    Request body:
    {
        "lat": 3.1390,
        "lon": 101.6869
    }
    
    Response:
    {
        "status": "urban" | "rural",
        "method": "rasterio" | "geopandas" | "heuristic",
        "confidence": "high" | "medium" | "low",
        "population_density": 1234.5 (optional),
        "region": "kl" (optional)
    }
    """
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No JSON data provided"}), 400
        
        lat = data.get('lat')
        lon = data.get('lon')
        
        if lat is None or lon is None:
            return jsonify({"error": "Missing 'lat' or 'lon' in request"}), 400
        
        # Validate coordinates
        if not (-90 <= lat <= 90) or not (-180 <= lon <= 180):
            return jsonify({"error": "Invalid coordinates"}), 400
        
        # Try rasterio first (most accurate if data available)
        result = classify_with_rasterio(lat, lon)
        
        # If rasterio failed, use heuristic
        if result.get("status") == "error":
            result = classify_with_heuristic(lat, lon)
        
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({
            "error": str(e),
            "status": "error"
        }), 500


@app.route('/classify-batch', methods=['POST'])
def classify_batch():
    """
    Classify multiple locations at once
    
    Request body:
    {
        "locations": [
            {"lat": 3.1390, "lon": 101.6869},
            {"lat": 1.4927, "lon": 110.3433}
        ]
    }
    """
    try:
        data = request.get_json()
        locations = data.get('locations', [])
        
        results = []
        for loc in locations:
            lat = loc.get('lat')
            lon = loc.get('lon')
            if lat and lon:
                result = classify_with_rasterio(lat, lon)
                if result.get("status") == "error":
                    result = classify_with_heuristic(lat, lon)
                results.append({
                    "lat": lat,
                    "lon": lon,
                    **result
                })
        
        return jsonify({"results": results}), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    # Create data directory if it doesn't exist
    DATA_DIR.mkdir(exist_ok=True)
    
    # Run the Flask app
    # In production, use a proper WSGI server like gunicorn
    app.run(host='0.0.0.0', port=5000, debug=True)