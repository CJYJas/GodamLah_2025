/**
 * Browser geolocation utilities
 */

export interface GeolocationPosition {
  lat: number
  lon: number
  accuracy?: number
  timestamp?: number
}

export interface GeolocationError {
  code: number
  message: string
}

/**
 * Get user's current location using browser Geolocation API
 */
export function getCurrentLocation(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject({
        code: 0,
        message: 'Geolocation is not supported by this browser',
      })
      return
    }

    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0, // Don't use cached position
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        })
      },
      (error) => {
        reject({
          code: error.code,
          message: error.message,
        })
      },
      options
    )
  })
}

/**
 * Watch user's location (for continuous updates)
 */
export function watchLocation(
  callback: (position: GeolocationPosition) => void,
  errorCallback?: (error: GeolocationError) => void
): number | null {
  if (!navigator.geolocation) {
    errorCallback?.({
      code: 0,
      message: 'Geolocation is not supported by this browser',
    })
    return null
  }

  const options: PositionOptions = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 5000, // Use cached position if less than 5 seconds old
  }

  return navigator.geolocation.watchPosition(
    (position) => {
      callback({
        lat: position.coords.latitude,
        lon: position.coords.longitude,
        accuracy: position.coords.accuracy,
        timestamp: position.timestamp,
      })
    },
    (error) => {
      errorCallback?.({
        code: error.code,
        message: error.message,
      })
    },
    options
  )
}

/**
 * Stop watching location
 */
export function clearWatch(watchId: number): void {
  navigator.geolocation.clearWatch(watchId)
}

/**
 * Check if geolocation permissions are granted
 */
export async function checkGeolocationPermission(): Promise<PermissionState> {
  if (!navigator.permissions) {
    return 'prompt' // Assume we can prompt if API not available
  }

  try {
    const result = await navigator.permissions.query({ name: 'geolocation' as PermissionName })
    return result.state
  } catch (error) {
    // Fallback for browsers that don't support permissions API
    return 'prompt'
  }
}

