"use client"

import { createContext, useContext, useState, ReactNode, useEffect } from "react"
import { getCurrentLocation } from "@/lib/utils/geolocation"
import { classifyLocation } from "@/lib/api/geolocation"

interface RuralModeContextType {
  isRuralMode: boolean
  setIsRuralMode: (value: boolean) => void
  location: string
  setLocation: (value: string) => void
  detectRuralFromAddress: (address: string) => boolean
  gpsLocation: { lat: number; lon: number } | null
  classificationResult: { status: string; method: string; confidence?: string } | null
  isDetecting: boolean
}

const RuralModeContext = createContext<RuralModeContextType | undefined>(undefined)

// Function to detect if an address is in a rural area
function isRuralAddress(address: string): boolean {
  if (!address) return false
  
  const addressLower = address.toLowerCase()
  
  // Malaysian rural indicators
  const ruralIndicators = [
    // States known for rural areas
    "sarawak",
    "sabah",
    // Rural area keywords
    "long ", // Long houses in Sarawak/Sabah
    "kampung",
    "kampong",
    "desa",
    "ulu", // Ulu (upstream/rural) areas
    "hulu",
    "interior",
    // Specific rural locations
    "semadoh",
    "ba kelalan",
    "bario",
    "mulu",
    "belaga",
    "baram",
    "limbang",
    "lawas",
    "kapit",
    "mukah",
    "kanowit",
    "song",
    "marudi",
    "telang usan",
    "long lama",
    "long san",
    "long terawan",
    "long seridan",
    "long luyang",
    "long napir",
    "long semado",
    "long luping",
    "long tanyit",
    "long atip",
    "long ungan",
    "long kiput",
    "long teru",
    "long terikan",
    "long terawan",
    "long teru",
    "long terikan",
  ]
  
  return ruralIndicators.some(indicator => addressLower.includes(indicator))
}

export function RuralModeProvider({ children }: { children: ReactNode }) {
  const [isRuralMode, setIsRuralMode] = useState(false)
  const [location, setLocation] = useState("")
  const [gpsLocation, setGpsLocation] = useState<{ lat: number; lon: number } | null>(null)
  const [classificationResult, setClassificationResult] = useState<{
    status: string
    method: string
    confidence?: string
  } | null>(null)
  const [isDetecting, setIsDetecting] = useState(false)

  const detectRuralFromAddress = (address: string): boolean => {
    return isRuralAddress(address)
  }

  // Auto-detect rural mode from GPS location on mount
  useEffect(() => {
    const detectFromGPS = async () => {
      // Check if we should auto-detect (only once, can be controlled by localStorage)
      const hasDetectedBefore = localStorage.getItem('rural_mode_gps_detected')
      if (hasDetectedBefore === 'true') {
        return // Already detected, don't ask again
      }

      setIsDetecting(true)
      try {
        // Get user's current location
        const position = await getCurrentLocation()
        setGpsLocation({ lat: position.lat, lon: position.lon })

        // Classify the location
        const result = await classifyLocation(position.lat, position.lon)
        setClassificationResult(result)

        // Auto-enable rural mode if classified as rural
        if (result.status === 'rural') {
          setIsRuralMode(true)
          // Set location from coordinates
          setLocation(`${position.lat.toFixed(4)}, ${position.lon.toFixed(4)}`)
          localStorage.setItem('rural_mode_gps_detected', 'true')
        } else if (result.status === 'urban') {
          // Explicitly set to urban (disable rural mode)
          setIsRuralMode(false)
          localStorage.setItem('rural_mode_gps_detected', 'true')
        }
      } catch (error) {
        console.log('GPS detection failed or denied:', error)
        // Don't show error to user, just silently fail
        // They can still manually enable rural mode
      } finally {
        setIsDetecting(false)
      }
    }

    // Only auto-detect if user hasn't manually set rural mode
    const manualOverride = localStorage.getItem('rural_mode_manual')
    if (!manualOverride) {
      detectFromGPS()
    }
  }, [])

  return (
    <RuralModeContext.Provider
      value={{
        isRuralMode,
        setIsRuralMode: (value: boolean) => {
          setIsRuralMode(value)
          localStorage.setItem('rural_mode_manual', 'true')
        },
        location,
        setLocation,
        detectRuralFromAddress,
        gpsLocation,
        classificationResult,
        isDetecting,
      }}
    >
      {children}
    </RuralModeContext.Provider>
  )
}

export function useRuralMode() {
  const context = useContext(RuralModeContext)
  if (context === undefined) {
    throw new Error("useRuralMode must be used within a RuralModeProvider")
  }
  return context
}

