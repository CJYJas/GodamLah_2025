"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useAppointments } from "@/contexts/appointments-context"
import {
  Car,
  MapPin,
  Clock,
  Phone,
  Calendar,
  Navigation,
  Ambulance,
  Bus,
  ChevronLeft,
  Check,
  X,
  AlertTriangle,
  Siren,
  Accessibility,
  Stethoscope,
  Building2,
} from "lucide-react"

const initialBookings = [
  {
    id: 1,
    type: "Scheduled Pickup",
    pickup: "No. 123, Jalan Ampang, KL",
    destination: "HUKM",
    date: "Dec 15, 2025",
    time: "8:00 AM",
    status: "confirmed",
    driver: "Encik Razak bin Ahmad",
    phone: "+60 12-345 6789",
    vehicle: "Toyota Vios - WXY 1234",
    vehicleColor: "Silver",
    trackingStatus: "requested",
    specialRequirements: [] as string[],
    estimatedFare: "RM 15.00",
    appointmentId: 1,
  },
]

export function TransportScreen() {
  const { getAppointmentsWithoutTransport, markTransportBooked } = useAppointments()
  const appointmentsWithoutTransport = getAppointmentsWithoutTransport()

  const [showBooking, setShowBooking] = useState(false)
  const [transportType, setTransportType] = useState<"regular" | "ambulance" | "public">("regular")
  const [bookings, setBookings] = useState(initialBookings)
  const [selectedAppointment, setSelectedAppointment] = useState<(typeof appointmentsWithoutTransport)[0] | null>(null)
  const [selectedRequirements, setSelectedRequirements] = useState<string[]>([])
  const [pickupAddress, setPickupAddress] = useState("No. 123, Jalan Ampang, KL")
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [trackingId, setTrackingId] = useState<number | null>(null)
  const [callingDriver, setCallingDriver] = useState(false)
  const [callDuration, setCallDuration] = useState(0)
  const [showEmergencyScreen, setShowEmergencyScreen] = useState(false)
  const [emergencyType, setEmergencyType] = useState<"medical" | "accident" | "other" | null>(null)
  const [estimatedFare, setEstimatedFare] = useState("RM 0.00")
  const [callingEmergency, setCallingEmergency] = useState(false)
  const [emergencyCallType, setEmergencyCallType] = useState<"999" | "hospital" | null>(null)

  useEffect(() => {
    const baseFare = transportType === "regular" ? 15 : transportType === "ambulance" ? 50 : 5
    const additionalFees = selectedRequirements.length * 5
    setEstimatedFare(`RM ${(baseFare + additionalFees).toFixed(2)}`)
  }, [transportType, selectedRequirements])

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (callingDriver || callingEmergency) {
      timer = setInterval(() => {
        setCallDuration((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [callingDriver, callingEmergency])

  const toggleRequirement = (req: string) => {
    setSelectedRequirements((prev) => (prev.includes(req) ? prev.filter((r) => r !== req) : [...prev, req]))
  }

  const handleTrack = (id: number) => {
    setTrackingId(id)
    setTimeout(() => {
      setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, trackingStatus: "assigned" } : b)))
    }, 8000)
    setTimeout(() => {
      setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, trackingStatus: "arrived" } : b)))
    }, 20000)
  }

  const formatCallDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  if (callingEmergency) {
    return (
      <div className="p-4 h-full flex flex-col items-center justify-center bg-gradient-to-b from-destructive to-destructive/80 text-destructive-foreground">
        <div className="w-24 h-24 rounded-full bg-destructive-foreground/20 flex items-center justify-center mb-6 animate-pulse">
          <Siren className="w-12 h-12" />
        </div>
        <h1 className="text-xl font-semibold mb-1">
          {emergencyCallType === "999" ? "Emergency Services" : "Hospital Hotline"}
        </h1>
        <p className="text-sm text-destructive-foreground/80 mb-2">
          {emergencyCallType === "999" ? "999" : "03-2615 5555"}
        </p>
        <p className="text-2xl font-mono mb-8">{formatCallDuration(callDuration)}</p>
        <p className="text-sm text-destructive-foreground/60 mb-8">Calling...</p>
        <Button
          variant="secondary"
          size="lg"
          className="rounded-full w-16 h-16"
          onClick={() => {
            setCallingEmergency(false)
            setEmergencyCallType(null)
            setCallDuration(0)
          }}
        >
          <X className="w-8 h-8" />
        </Button>
      </div>
    )
  }

  if (callingDriver) {
    const booking = bookings.find((b) => b.id === trackingId) || bookings[0]
    return (
      <div className="p-4 h-full flex flex-col items-center justify-center bg-gradient-to-b from-primary to-primary/80 text-primary-foreground">
        <div className="w-24 h-24 rounded-full bg-primary-foreground/20 flex items-center justify-center mb-6 overflow-hidden">
          <img src="/malay-male-driver-portrait.jpg" alt="Driver" className="w-full h-full object-cover" />
        </div>
        <h1 className="text-xl font-semibold mb-1">{booking.driver}</h1>
        <p className="text-sm text-primary-foreground/80 mb-2">{booking.vehicle}</p>
        <p className="text-2xl font-mono mb-8">{formatCallDuration(callDuration)}</p>
        <p className="text-sm text-primary-foreground/60 mb-8">Calling...</p>
        <Button
          variant="destructive"
          size="lg"
          className="rounded-full w-16 h-16"
          onClick={() => {
            setCallingDriver(false)
            setCallDuration(0)
          }}
        >
          <X className="w-8 h-8" />
        </Button>
      </div>
    )
  }

  if (showEmergencyScreen) {
    return (
      <div className="p-4 space-y-5">
        <header className="flex items-center gap-3">
          <button
            onClick={() => {
              setShowEmergencyScreen(false)
              setEmergencyType(null)
            }}
            className="p-2 -ml-2 rounded-full hover:bg-secondary transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold text-destructive">Emergency Services</h1>
        </header>

        <Card className="p-4 bg-destructive/10 border-destructive/30">
          <div className="flex items-center gap-3 mb-4">
            <Siren className="w-8 h-8 text-destructive animate-pulse" />
            <div>
              <h2 className="font-semibold text-destructive">Emergency Assistance</h2>
              <p className="text-sm text-muted-foreground">Select the type of emergency</p>
            </div>
          </div>
        </Card>

        <section>
          <h2 className="text-sm font-medium text-muted-foreground mb-3">Type of Emergency</h2>
          <div className="space-y-2">
            {[
              {
                type: "medical" as const,
                label: "Medical Emergency",
                icon: Ambulance,
                desc: "Chest pain, breathing difficulty, severe injury",
              },
              {
                type: "accident" as const,
                label: "Road Accident",
                icon: Car,
                desc: "Vehicle collision, pedestrian accident",
              },
              {
                type: "other" as const,
                label: "Other Emergency",
                icon: AlertTriangle,
                desc: "Fire, security, other urgent situations",
              },
            ].map((item) => (
              <Card
                key={item.type}
                className={`p-4 cursor-pointer transition-all ${
                  emergencyType === item.type ? "border-destructive bg-destructive/5" : "hover:bg-secondary"
                }`}
                onClick={() => setEmergencyType(item.type)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-destructive" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  {emergencyType === item.type && <Check className="w-5 h-5 text-destructive" />}
                </div>
              </Card>
            ))}
          </div>
        </section>

        <Card className="p-4">
          <h3 className="font-medium mb-3">Your Current Location</h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <MapPin className="w-4 h-4" />
            <span>No. 123, Jalan Ampang, Kuala Lumpur</span>
          </div>
          <Button variant="outline" size="sm" className="w-full bg-transparent">
            <Navigation className="w-4 h-4 mr-2" /> Update Location
          </Button>
        </Card>

        {/* Emergency Contacts */}
        <Card className="p-4 border-destructive/30">
          <h3 className="font-medium mb-3 text-destructive">Emergency Contacts</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Emergency Contact:</span>
              <span className="font-medium">Siti Aminah (Wife)</span>
            </div>
            <div className="flex justify-between">
              <span>Phone:</span>
              <span className="font-medium">+60 12-987 6543</span>
            </div>
          </div>
        </Card>

        <div className="space-y-2 pt-4">
          <Button
            variant="destructive"
            className="w-full h-14 text-lg"
            disabled={!emergencyType}
            onClick={() => {
              setEmergencyCallType("999")
              setCallingEmergency(true)
              setCallDuration(0)
            }}
          >
            <Phone className="w-5 h-5 mr-2" /> Call 999 Emergency
          </Button>
          <Button
            variant="outline"
            className="w-full bg-transparent"
            onClick={() => {
              setEmergencyCallType("hospital")
              setCallingEmergency(true)
              setCallDuration(0)
            }}
          >
            <Building2 className="w-4 h-4 mr-2" /> Hospital Hotline: 03-2615 5555
          </Button>
        </div>
      </div>
    )
  }

  if (trackingId !== null) {
    const booking = bookings.find((b) => b.id === trackingId)
    if (!booking) return null

    const steps = [
      { key: "requested", label: "Requested", desc: "Waiting for driver assignment" },
      { key: "assigned", label: "Driver Assigned", desc: "Driver is on the way to pickup" },
      { key: "arrived", label: "Driver Arrived", desc: "Driver has arrived at pickup location" },
    ]
    const currentStep = steps.findIndex((s) => s.key === booking.trackingStatus)

    return (
      <div className="p-4 space-y-5">
        <header className="flex items-center gap-3">
          <button
            onClick={() => setTrackingId(null)}
            className="p-2 -ml-2 rounded-full hover:bg-secondary transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold">Track Transport</h1>
        </header>

        {/* Status Timeline */}
        <Card className="p-4">
          <div className="space-y-4">
            {steps.map((step, index) => {
              const isCompleted = index <= currentStep
              const isCurrent = index === currentStep
              return (
                <div key={step.key} className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isCompleted ? "bg-accent text-accent-foreground" : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      {isCompleted ? <Check className="w-4 h-4" /> : <span className="text-sm">{index + 1}</span>}
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`w-0.5 h-8 ${index < currentStep ? "bg-accent" : "bg-secondary"}`} />
                    )}
                  </div>
                  <div className={`pt-1 ${isCurrent ? "" : "opacity-60"}`}>
                    <p className="font-medium text-sm">{step.label}</p>
                    <p className="text-xs text-muted-foreground">{step.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>

        {booking.trackingStatus !== "requested" && (
          <Card className="p-4">
            <h2 className="text-sm font-medium text-muted-foreground mb-3">Driver Information</h2>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border-2 border-primary/20">
                <img src="/malay-male-driver-portrait.jpg" alt="Driver" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-lg">{booking.driver}</p>
                <p className="text-sm text-muted-foreground">{booking.vehicle}</p>
                <div className="flex items-center gap-2 mt-2">
                  <div
                    className="w-4 h-4 rounded-full border-2 border-gray-300"
                    style={{ backgroundColor: booking.vehicleColor.toLowerCase() === "silver" ? "#C0C0C0" : "#808080" }}
                  />
                  <span className="text-sm font-medium">{booking.vehicleColor} Vehicle</span>
                </div>
                <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                  <Phone className="w-3 h-3" />
                  <span>{booking.phone}</span>
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full bg-transparent"
              onClick={() => {
                setCallingDriver(true)
                setTrackingId(booking.id)
                setCallDuration(0)
              }}
            >
              <Phone className="w-4 h-4 mr-2" /> Call Driver
            </Button>
          </Card>
        )}

        {/* Trip Details */}
        <Card className="p-4">
          <h2 className="text-sm font-medium text-muted-foreground mb-3">Trip Details</h2>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">From:</span>
              <span>{booking.pickup}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="text-muted-foreground">To:</span>
              <span>{booking.destination}</span>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" /> {booking.date}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" /> {booking.time}
              </span>
            </div>
            {booking.specialRequirements.length > 0 && (
              <div className="flex items-center gap-2 mt-2">
                <Accessibility className="w-4 h-4 text-accent" />
                <span className="text-xs text-accent font-medium">{booking.specialRequirements.join(", ")}</span>
              </div>
            )}
            <div className="pt-2 border-t border-border mt-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Estimated Fare:</span>
                <span className="font-semibold text-primary">{booking.estimatedFare}</span>
              </div>
            </div>
          </div>
        </Card>

        <Button variant="destructive" className="w-full" onClick={() => setShowEmergencyScreen(true)}>
          <Siren className="w-4 h-4 mr-2" /> Emergency
        </Button>
      </div>
    )
  }

  if (showConfirmation && selectedAppointment) {
    return (
      <div className="p-4 space-y-5">
        <div className="flex flex-col items-center justify-center py-8">
          <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-4">
            <Check className="w-8 h-8 text-accent" />
          </div>
          <h1 className="text-xl font-semibold mb-2">Transport Booked!</h1>
          <p className="text-sm text-muted-foreground text-center mb-6">Your transport has been successfully booked.</p>

          <Card className="p-4 w-full mb-6">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Type</span>
                <span className="font-medium capitalize">{transportType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Pickup</span>
                <span className="font-medium text-right text-xs">{pickupAddress}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Destination</span>
                <span className="font-medium">{selectedAppointment.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date</span>
                <span className="font-medium">{selectedAppointment.date}</span>
              </div>
              {selectedRequirements.length > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Special Needs</span>
                  <span className="font-medium text-right text-xs">{selectedRequirements.join(", ")}</span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-border">
                <span className="text-muted-foreground font-medium">Estimated Fare</span>
                <span className="font-semibold text-primary">{estimatedFare}</span>
              </div>
            </div>
          </Card>

          <Button
            className="w-full"
            onClick={() => {
              const newBooking = {
                id: Date.now(),
                type: "Scheduled Pickup",
                pickup: pickupAddress,
                destination: selectedAppointment.location,
                date: selectedAppointment.date,
                time: selectedAppointment.time,
                status: "confirmed",
                driver: "Encik Razak bin Ahmad",
                phone: "+60 12-345 6789",
                vehicle: "Toyota Vios - WXY 1234",
                vehicleColor: "Silver",
                trackingStatus: "requested",
                specialRequirements: selectedRequirements,
                estimatedFare: estimatedFare,
                appointmentId: selectedAppointment.id,
              }
              setBookings([...bookings, newBooking])
              markTransportBooked(selectedAppointment.id)
              setShowConfirmation(false)
              setShowBooking(false)
              setSelectedAppointment(null)
              setSelectedRequirements([])
            }}
          >
            Done
          </Button>
        </div>
      </div>
    )
  }

  if (showBooking) {
    return (
      <div className="p-4 space-y-5">
        <header className="flex items-center gap-3">
          <button
            onClick={() => setShowBooking(false)}
            className="p-2 -ml-2 rounded-full hover:bg-secondary transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg font-semibold">Book Transport</h1>
            <p className="text-sm text-muted-foreground">For your medical appointment</p>
          </div>
        </header>

        {/* Transport Type Selection */}
        <section>
          <h2 className="text-sm font-medium text-muted-foreground mb-3">Transport Type</h2>
          <div className="grid grid-cols-3 gap-2">
            <Card
              className={`p-3 cursor-pointer text-center transition-all ${
                transportType === "regular" ? "border-primary bg-primary/5" : ""
              }`}
              onClick={() => setTransportType("regular")}
            >
              <Car className="w-6 h-6 mx-auto mb-2 text-primary" />
              <span className="text-xs font-medium">Regular</span>
              <p className="text-xs text-muted-foreground">RM 15+</p>
            </Card>
            <Card
              className={`p-3 cursor-pointer text-center transition-all ${
                transportType === "ambulance" ? "border-primary bg-primary/5" : ""
              }`}
              onClick={() => setTransportType("ambulance")}
            >
              <Ambulance className="w-6 h-6 mx-auto mb-2 text-destructive" />
              <span className="text-xs font-medium">Ambulance</span>
              <p className="text-xs text-muted-foreground">RM 50+</p>
            </Card>
            <Card
              className={`p-3 cursor-pointer text-center transition-all ${
                transportType === "public" ? "border-primary bg-primary/5" : ""
              }`}
              onClick={() => setTransportType("public")}
            >
              <Bus className="w-6 h-6 mx-auto mb-2 text-accent" />
              <span className="text-xs font-medium">Public</span>
              <p className="text-xs text-muted-foreground">RM 5+</p>
            </Card>
          </div>
        </section>

        {/* Pickup Location */}
        <section>
          <h2 className="text-sm font-medium text-muted-foreground mb-3">Pickup Location</h2>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Enter pickup address"
              className="pl-10"
              value={pickupAddress}
              onChange={(e) => setPickupAddress(e.target.value)}
            />
          </div>
          <Button variant="link" size="sm" className="text-xs px-0 h-auto mt-1">
            <Navigation className="w-3 h-3 mr-1" /> Use current location
          </Button>
        </section>

        {/* Appointment Selection - Only those without transport */}
        <section>
          <h2 className="text-sm font-medium text-muted-foreground mb-3">Select Appointment (Destination)</h2>
          {appointmentsWithoutTransport.length === 0 ? (
            <Card className="p-4 text-center">
              <p className="text-sm text-muted-foreground">All appointments have transport booked</p>
            </Card>
          ) : (
            <div className="space-y-2">
              {appointmentsWithoutTransport.map((apt) => (
                <Card
                  key={apt.id}
                  className={`p-3 cursor-pointer transition-all ${
                    selectedAppointment?.id === apt.id ? "border-primary bg-primary/5" : "hover:bg-secondary"
                  }`}
                  onClick={() => setSelectedAppointment(apt)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                      <Stethoscope className="w-5 h-5 text-accent" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{apt.type}</p>
                      <p className="text-xs text-muted-foreground">
                        {apt.date} at {apt.location}
                      </p>
                    </div>
                    {selectedAppointment?.id === apt.id && <Check className="w-5 h-5 text-primary" />}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Special Requirements */}
        <section>
          <h2 className="text-sm font-medium text-muted-foreground mb-3">Special Requirements (+RM 5 each)</h2>
          <div className="flex flex-wrap gap-2">
            {["Wheelchair", "Oxygen", "Stretcher", "Elderly Care", "IV Drip"].map((req) => (
              <Badge
                key={req}
                variant={selectedRequirements.includes(req) ? "default" : "outline"}
                className={`cursor-pointer ${selectedRequirements.includes(req) ? "" : "bg-transparent"}`}
                onClick={() => toggleRequirement(req)}
              >
                {selectedRequirements.includes(req) && <Check className="w-3 h-3 mr-1" />}
                {req}
              </Badge>
            ))}
          </div>
        </section>

        {/* Estimated Fare */}
        <Card className="p-4 bg-primary/5 border-primary/20">
          <div className="flex justify-between items-center">
            <span className="font-medium">Estimated Fare:</span>
            <span className="text-xl font-bold text-primary">{estimatedFare}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Final fare may vary based on distance and traffic</p>
        </Card>

        <Button className="w-full" disabled={!selectedAppointment} onClick={() => setShowConfirmation(true)}>
          Confirm Booking
        </Button>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-5">
      {/* Header */}
      <header>
        <h1 className="text-lg font-semibold">Transport</h1>
        <p className="text-sm text-muted-foreground">Medical transport services</p>
      </header>

      {/* Quick Book */}
      <Card
        className="p-4 bg-primary text-primary-foreground cursor-pointer hover:bg-primary/90 transition-colors"
        onClick={() => setShowBooking(true)}
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary-foreground/20 flex items-center justify-center">
            <Car className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h2 className="font-semibold">Book Transport</h2>
            <p className="text-sm text-primary-foreground/80">Schedule a ride to your appointment</p>
          </div>
        </div>
      </Card>

      {/* Upcoming Bookings */}
      <section>
        <h2 className="text-sm font-medium text-muted-foreground mb-3">Upcoming Bookings</h2>
        <div className="space-y-3">
          {bookings.map((booking) => (
            <Card key={booking.id} className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Car className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">{booking.type}</h3>
                    <p className="text-xs text-muted-foreground">{booking.destination}</p>
                  </div>
                </div>
                <Badge
                  className={`bg-accent text-accent-foreground ${booking.status === "confirmed" ? "bg-green-500 text-white" : ""}`}
                >
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> {booking.date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {booking.time}
                </span>
              </div>
              {booking.specialRequirements.length > 0 && (
                <div className="flex items-center gap-2 mb-3">
                  <Accessibility className="w-4 h-4 text-accent" />
                  <span className="text-xs text-accent font-medium">{booking.specialRequirements.join(", ")}</span>
                </div>
              )}
              {/* Show estimated fare */}
              <div className="flex items-center justify-between text-sm mb-3 pt-2 border-t border-border">
                <span className="text-muted-foreground">Estimated Fare:</span>
                <span className="font-semibold text-primary">{booking.estimatedFare}</span>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 text-xs bg-transparent"
                  onClick={() => {
                    setCallingDriver(true)
                    setTrackingId(booking.id)
                    setCallDuration(0)
                  }}
                >
                  <Phone className="w-3 h-3 mr-1" /> Call
                </Button>
                <Button size="sm" className="flex-1 text-xs" onClick={() => handleTrack(booking.id)}>
                  <Navigation className="w-3 h-3 mr-1" /> Track
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Emergency */}
      <Card
        className="p-4 bg-destructive/10 border-destructive/20 cursor-pointer hover:bg-destructive/15 transition-colors"
        onClick={() => setShowEmergencyScreen(true)}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-destructive/20 flex items-center justify-center">
            <Siren className="w-5 h-5 text-destructive" />
          </div>
          <div>
            <h3 className="font-medium text-destructive">Emergency Transport</h3>
            <p className="text-xs text-muted-foreground">Request immediate medical transport</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
