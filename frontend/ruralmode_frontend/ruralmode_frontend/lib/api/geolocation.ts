/**
 * API service for geospatial location classification
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export interface ClassificationResult {
  status: 'rural' | 'urban' | 'unknown' | 'error'
  method: 'rasterio' | 'geopandas' | 'heuristic'
  confidence?: 'high' | 'medium' | 'low'
  population_density?: number
  region?: string
  threshold?: number
  error?: string
}

export interface Coordinates {
  lat: number
  lon: number
}

/**
 * Classify a location as rural or urban
 */
export async function classifyLocation(
  lat: number,
  lon: number
): Promise<ClassificationResult> {
  try {
    const response = await fetch(`${API_BASE_URL}/classify-location`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ lat, lon }),
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error classifying location:', error)
    // Return fallback classification
    return {
      status: 'unknown',
      method: 'heuristic',
      confidence: 'low',
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Classify multiple locations at once
 */
export async function classifyBatch(
  locations: Coordinates[]
): Promise<ClassificationResult[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/classify-batch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ locations }),
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`)
    }

    const data = await response.json()
    return data.results || []
  } catch (error) {
    console.error('Error classifying batch:', error)
    return []
  }
}

/**
 * Check if the backend API is available
 */
export async function checkApiHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
    })
    return response.ok
  } catch (error) {
    return false
  }
}

