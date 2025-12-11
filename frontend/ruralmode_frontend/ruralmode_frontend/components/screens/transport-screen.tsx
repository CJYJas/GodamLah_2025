"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Car, MapPin, Clock, Phone, Calendar, Navigation, Ambulance, Bus, ChevronLeft, Check, User, Ship, Plane, Stethoscope, BriefcaseMedical } from "lucide-react"
import { useRuralMode } from "@/contexts/rural-mode-context"

// --- Helper Data and Types ---

const transportTypeMap: { [key: string]: string } = {
  regular: "Regular Transport",
  ambulance: "Ambulance",
  public: "Public Transport",
  boat: "Boat Transport",
  helicopter: "Helicopter Transport",
}

const appointmentsWithoutTransport = [
  { id: 1, type: "General Checkup", date: "Dec 15, 2025", time: "9:00 AM", location: "Serian Hospital" },
  { id: 2, type: "Blood Test", date: "Dec 18, 2025", time: "7:30 AM", location: "Sarawak General Hospital (SGH)" },
  { id: 3, type: "Follow-up", date: "Dec 22, 2025", time: "2:00 PM", location: "Sibu Hospital" },
]

// Extended Booking type to handle Doctor/Driver and different vehicle/service names
type Booking = {
  id: number
  type: string
  pickup: string
  destination: string
  date: string
  time: string
  status: "confirmed"
  driverOrDoctor: string // Renamed for clarity
  phone: string
  vehicleOrService: string // Renamed for clarity
  trackingStatus: "requested" | "assigned" | "arrived" // requested, assigned, arrived
  reason?: string // For Home Visit
}

const initialBookings: Booking[] = [
  {
    id: 1,
    type: "Boat Transport", // Changed type to match the vehicle better
    pickup: "No. 12, Rumah Panjang Meranti Kampung Meranti, Siburan 94200, Serian Sarawak",
    destination: "Serian Hospital",
    date: "Dec 15, 2025",
    time: "8:00 AM",
    status: "confirmed",
    driverOrDoctor: "Encik Razak",
    phone: "+60 12-345 6789",
    vehicleOrService: "Boat - WXY 1234",
    trackingStatus: "requested",
  },
]

// Helper function to determine the icon based on booking type
const getBookingIcon = (type: string) => {
  switch (type) {
    case "Home Visit":
      return <Stethoscope className="w-5 h-5 text-accent" />
    case "Boat Transport":
      return <Ship className="w-5 h-5 text-accent" />
    case "Helicopter Transport":
      return <Plane className="w-5 h-5 text-accent" />
    case "Ambulance":
      return <Ambulance className="w-5 h-5 text-accent" />
    case "Public Transport":
      return <Bus className="w-5 h-5 text-accent" />
    default:
      // Covers "Regular Transport" and other fallbacks
      return <Car className="w-5 h-5 text-accent" />
  }
}

// --- Component ---

export function TransportScreen() {
  const { isRuralMode, location } = useRuralMode()
  const [showBooking, setShowBooking] = useState(false)
  const [showDoctorBooking, setShowDoctorBooking] = useState(false)
  const [transportType, setTransportType] = useState<"regular" | "ambulance" | "public" | "boat" | "helicopter">("regular")
  const [bookings, setBookings] = useState<Booking[]>(initialBookings)
  const [selectedAppointment, setSelectedAppointment] = useState<(typeof appointmentsWithoutTransport)[0] | null>(null)
  const [selectedRequirements, setSelectedRequirements] = useState<string[]>([])
  const [specialNotes, setSpecialNotes] = useState("")
  const [pickupAddress, setPickupAddress] = useState(isRuralMode ? location || "" : "No. 12, Rumah Panjang Meranti Kampung Meranti, Siburan 94200, Serian Sarawak")
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [trackingId, setTrackingId] = useState<number | null>(null)
  const [showEmergencyConfirm, setShowEmergencyConfirm] = useState(false)
  const [cannotReachByVan, setCannotReachByVan] = useState(false)
  const [doctorBookingDate, setDoctorBookingDate] = useState("")
  const [doctorBookingTime, setDoctorBookingTime] = useState("")
  const [doctorBookingReason, setDoctorBookingReason] = useState("")
  const [showDoctorConfirmation, setShowDoctorConfirmation] = useState(false)

  // Sync pickup address with location when location changes in rural mode
  useEffect(() => {
    if (isRuralMode && location && !showBooking && !showDoctorBooking) {
      setPickupAddress(location)
    }
  }, [location, isRuralMode, showBooking, showDoctorBooking])

  const toggleRequirement = (req: string) => {
    setSelectedRequirements((prev) => (prev.includes(req) ? prev.filter((r) => r !== req) : [...prev, req]))
  }

  const handleTrack = (id: number) => {
    setTrackingId(id)
    // Simulate status progression
    setTimeout(() => {
      setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, trackingStatus: "assigned" } : b)))
    }, 2000)
    setTimeout(() => {
      setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, trackingStatus: "arrived" } : b)))
    }, 5000)
  }

  if (trackingId !== null) {
    const booking = bookings.find((b) => b.id === trackingId)
    if (!booking) return null

    const isHomeVisit = booking.type === "Home Visit"

    let steps = []
    if (isHomeVisit) {
        // Corrected steps for Home Visit: removed the ambiguous "Arrived at Pickup"
        steps = [
            { key: "requested", label: "Requested", desc: "Waiting for specialist assignment" },
            { key: "assigned", label: "Specialist Assigned", desc: "Specialist is traveling to your location" },
            { key: "arrived", label: "Visit Started", desc: "Consultation in progress" }, // Key change here
        ]
    } else {
        // Transport steps
        steps = [
            { key: "requested", label: "Requested", desc: "Waiting for driver assignment" },
            { key: "assigned", label: "Driver Assigned", desc: "Driver is on the way" },
            { key: "arrived", label: "Driver Arrived", desc: "Driver has arrived at pickup" },
        ]
    }
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
          <h1 className="text-lg font-semibold">Track {isHomeVisit ? "Home Visit" : "Transport"}</h1>
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

        {/* Info - Show when assigned */}
        {booking.trackingStatus !== "requested" && (
          <Card className="p-4">
            <h2 className="text-sm font-medium text-muted-foreground mb-3">{isHomeVisit ? "Specialist" : "Driver"} Information</h2>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                {isHomeVisit ? <Stethoscope className="w-6 h-6 text-primary" /> : <User className="w-6 h-6 text-primary" />}
              </div>
              <div>
                <p className="font-medium">{booking.driverOrDoctor}</p>
                <p className="text-sm text-muted-foreground">{booking.vehicleOrService}</p>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full bg-transparent"
              onClick={() => window.open(`tel:${booking.phone}`)}
            >
              <Phone className="w-4 h-4 mr-2" /> Call {isHomeVisit ? "Specialist" : "Driver"} ({booking.phone})
            </Button>
          </Card>
        )}

        {/* Trip/Visit Details */}
        <Card className="p-4">
          <h2 className="text-sm font-medium text-muted-foreground mb-3">{isHomeVisit ? "Visit" : "Trip"} Details</h2>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">{isHomeVisit ? "Location:" : "From:"}</span>
              <span>{booking.pickup}</span>
            </div>
            {!isHomeVisit && (
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground">To:</span>
                <span>{booking.destination}</span>
              </div>
            )}
            {isHomeVisit && booking.reason && (
              <div className="text-sm">
                <span className="text-muted-foreground">Reason: </span>
                <span className="font-medium">{booking.reason}</span>
              </div>
            )}
            <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" /> {booking.date}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" /> {booking.time}
              </span>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  if (showConfirmation) {
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
                <span className="font-medium">{transportTypeMap[transportType] || "Transport"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Pickup</span>
                <span className="font-medium text-right max-w-[60%]">{pickupAddress}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Destination</span>
                <span className="font-medium text-right max-w-[60%]">{selectedAppointment?.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date</span>
                <span className="font-medium">{selectedAppointment?.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Time</span>
                <span className="font-medium">{selectedAppointment?.time}</span>
              </div>
              {cannotReachByVan && (
                <div className="bg-accent/10 border border-accent/20 rounded-lg p-3 mt-2">
                  <p className="text-xs text-foreground">
                    <strong>Special Allocation:</strong> We've allocated {transportTypeMap[transportType]} for your transport as your location cannot be reached by car/van.
                  </p>
                </div>
              )}
              {selectedRequirements.length > 0 && (
                <div className="flex justify-between pt-2">
                  <span className="text-muted-foreground">Requirements</span>
                  <span className="font-medium text-right max-w-[60%]">{selectedRequirements.join(", ")}</span>
                </div>
              )}
              {specialNotes.trim() && (
                <div className="pt-2">
                    <span className="text-muted-foreground">Notes: </span>
                    <span className="font-medium text-right max-w-[60%]">{specialNotes}</span>
                </div>
              )}
            </div>
          </Card>

          <Button
            className="w-full"
            onClick={() => {
              const transportTypeLabel = transportTypeMap[transportType] || "Transport"
              
              const newBooking: Booking = {
                id: Date.now(),
                type: transportTypeLabel,
                pickup: pickupAddress,
                destination: selectedAppointment?.location || "Hospital",
                date: selectedAppointment?.date || "",
                time: selectedAppointment?.time || "",
                status: "confirmed",
                driverOrDoctor: transportType === "ambulance" ? "Paramedic Team" : "Hafizul Azhar",
                phone: "+60 12-588 6760",
                vehicleOrService: transportType === "boat" ? "SKW 5678 C" :
                         transportType === "helicopter" ? "Medical Helicopter" :
                         transportType === "ambulance" ? "Ambulance" :
                         "Transport Van",
                trackingStatus: "requested",
              }
              setBookings((prev) => [newBooking, ...prev])
              setShowConfirmation(false)
              setShowBooking(false)
              setSelectedAppointment(null)
              setSelectedRequirements([])
              setSpecialNotes("")
              setCannotReachByVan(false)
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
          <div className={`grid gap-2 ${isRuralMode ? "grid-cols-3" : "grid-cols-3"}`}>
            <Card
              className={`p-3 cursor-pointer text-center transition-all ${
                transportType === "regular" ? "border-primary bg-primary/5" : ""
              }`}
              onClick={() => setTransportType("regular")}
            >
              <Car className="w-6 h-6 mx-auto mb-2 text-primary" />
              <span className="text-xs font-medium">Car/Van</span>
            </Card>
            <Card
              className={`p-3 cursor-pointer text-center transition-all ${
                transportType === "ambulance" ? "border-primary bg-primary/5" : ""
              }`}
              onClick={() => setTransportType("ambulance")}
            >
              <Ambulance className="w-6 h-6 mx-auto mb-2 text-destructive" />
              <span className="text-xs font-medium">Ambulance</span>
            </Card>
            {!isRuralMode && (
              <Card
                className={`p-3 cursor-pointer text-center transition-all ${
                  transportType === "public" ? "border-primary bg-primary/5" : ""
                }`}
                onClick={() => setTransportType("public")}
              >
                <Bus className="w-6 h-6 mx-auto mb-2 text-accent" />
                <span className="text-xs font-medium">Public</span>
              </Card>
            )}
            {isRuralMode && (
              <>
                <Card
                  className={`p-3 cursor-pointer text-center transition-all ${
                    transportType === "boat" ? "border-primary bg-primary/5" : ""
                  }`}
                  onClick={() => setTransportType("boat")}
                >
                  <Ship className="w-6 h-6 mx-auto mb-2 text-accent" />
                  <span className="text-xs font-medium">Boat</span>
                </Card>
                <Card
                  className={`p-3 cursor-pointer text-center transition-all ${
                    transportType === "helicopter" ? "border-primary bg-primary/5" : ""
                  }`}
                  onClick={() => setTransportType("helicopter")}
                >
                  <Plane className="w-6 h-6 mx-auto mb-2 text-accent" />
                  <span className="text-xs font-medium">Helicopter</span>
                </Card>
              </>
            )}
          </div>
        </section>

        {/* Pickup Location */}
        <section>
          <h2 className="text-sm font-medium text-muted-foreground mb-3">Pickup Location</h2>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={isRuralMode ? "Enter your rural location (e.g., Long Semadoh, Sarawak)" : "Enter pickup address"}
              className="pl-10"
              value={pickupAddress}
              onChange={(e) => setPickupAddress(e.target.value)}
            />
          </div>
          {isRuralMode && location && (
            <Button
              variant="link"
              size="sm"
              className="text-xs px-0 h-auto mt-1"
              onClick={() => setPickupAddress(location)}
            >
              <MapPin className="w-3 h-3 mr-1" /> Use saved location: {location}
            </Button>
          )}
          {!isRuralMode && (
            <Button variant="link" size="sm" className="text-xs px-0 h-auto mt-1">
              <Navigation className="w-3 h-3 mr-1" /> Use current location
            </Button>
          )}
          {isRuralMode && (
            <div className="mt-3 space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="cannotReachByVan"
                  checked={cannotReachByVan}
                  onChange={(e) => {
                    setCannotReachByVan(e.target.checked)
                    if (e.target.checked && transportType === "regular") {
                        // Auto-select boat or helicopter if cannot reach by van
                        setTransportType("boat")
                    }
                  }}
                  className="w-4 h-4 rounded border-border"
                />
                <label htmlFor="cannotReachByVan" className="text-sm text-muted-foreground cursor-pointer">
                  Cannot reach any hospital by car/van from my location
                </label>
              </div>
              {cannotReachByVan && (
                <div className="bg-accent/10 border border-accent/20 rounded-lg p-3">
                  <p className="text-xs text-foreground">
                    We'll allocate a boat or helicopter to transport you. Please describe your location access in the notes below.
                  </p>
                </div>
              )}
            </div>
          )}
        </section>

        <section>
          <h2 className="text-sm font-medium text-muted-foreground mb-3">Select Appointment</h2>
          <div className="space-y-2">
            {appointmentsWithoutTransport.map((apt) => (
              <Card
                key={apt.id}
                className={`p-3 cursor-pointer transition-all ${
                  selectedAppointment?.id === apt.id ? "border-primary bg-primary/5" : "hover:bg-secondary"
                }`}
                onClick={() => setSelectedAppointment(apt)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{apt.type}</p>
                    <p className="text-xs text-muted-foreground">
                      {apt.date} at {apt.time}
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <BriefcaseMedical className="w-3 h-3" /> {apt.location}
                    </p>
                  </div>
                  {selectedAppointment?.id === apt.id && <Check className="w-4 h-4 text-primary" />}
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-sm font-medium text-muted-foreground mb-3">Special Requirements</h2>
          <div className="flex flex-wrap gap-2">
            {["Wheelchair", "Stretcher", "Oxygen", "Caregiver"].map((req) => (
              <Badge
                key={req}
                variant={selectedRequirements.includes(req) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => toggleRequirement(req)}
              >
                {req}
              </Badge>
            ))}
          </div>
          <Textarea
            placeholder="Any additional notes..."
            className="mt-3"
            value={specialNotes}
            onChange={(e) => setSpecialNotes(e.target.value)}
          />
        </section>

        <div className="space-y-2 pt-2">
          <Button className="w-full" disabled={!selectedAppointment} onClick={() => setShowConfirmation(true)}>
            Confirm Booking
          </Button>
          <Button
            variant="outline"
            className="w-full bg-transparent"
            onClick={() => {
              setShowBooking(false)
              setCannotReachByVan(false)
            }}
          >
            Cancel
          </Button>
        </div>
      </div>
    )
  }

  if (showDoctorBooking) {
    const availableDates = [16, 17, 18, 19, 20, 22, 23]
    const timeSlots = ["9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM", "4:00 PM"]

    return (
      <div className="p-4 space-y-5">
        <header className="flex items-center gap-3">
          <button
            onClick={() => setShowDoctorBooking(false)}
            className="p-2 -ml-2 rounded-full hover:bg-secondary transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg font-semibold">Book Home Visit</h1>
            <p className="text-sm text-muted-foreground">Request a doctor to visit your location</p>
          </div>
        </header>

        <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Stethoscope className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground">Rural Home Visit Service</p>
              <p className="text-xs text-muted-foreground mt-1">
                A doctor will visit your location. This service is available for rural areas where hospital access is limited.
              </p>
            </div>
          </div>
        </div>

        <section>
          <h2 className="text-sm font-medium text-muted-foreground mb-3">Your Location</h2>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Enter your location (e.g., Long Semadoh, Sarawak)"
              className="pl-10"
              value={pickupAddress}
              onChange={(e) => setPickupAddress(e.target.value)}
            />
          </div>
        </section>

        <section>
          <h2 className="text-sm font-medium text-muted-foreground mb-3">Select Date</h2>
          <div className="grid grid-cols-4 gap-2">
            {availableDates.map((date) => (
              <Button
                key={date}
                variant={doctorBookingDate === `Dec ${date}, 2025` ? "default" : "outline"}
                size="sm"
                className={doctorBookingDate === `Dec ${date}, 2025` ? "" : "bg-transparent"}
                onClick={() => setDoctorBookingDate(`Dec ${date}, 2025`)}
              >
                Dec {date}
              </Button>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-sm font-medium text-muted-foreground mb-3">Select Time</h2>
          <div className="grid grid-cols-3 gap-2">
            {timeSlots.map((time) => (
              <Button
                key={time}
                variant={doctorBookingTime === time ? "default" : "outline"}
                size="sm"
                className={doctorBookingTime === time ? "" : "bg-transparent"}
                onClick={() => setDoctorBookingTime(time)}
              >
                {time}
              </Button>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-sm font-medium text-muted-foreground mb-3">Reason for Visit</h2>
          <Textarea
            placeholder="Describe your medical concern or reason for the home visit..."
            value={doctorBookingReason}
            onChange={(e) => setDoctorBookingReason(e.target.value)}
            rows={4}
          />
        </section>

        <div className="space-y-2 pt-2">
          <Button
            className="w-full"
            disabled={!doctorBookingDate || !doctorBookingTime || !pickupAddress.trim() || !doctorBookingReason.trim()}
            onClick={(e) => {
              e.preventDefault()
              if (doctorBookingDate && doctorBookingTime && pickupAddress.trim() && doctorBookingReason.trim()) {
                setShowDoctorBooking(false)
                setShowDoctorConfirmation(true)
              }
            }}
          >
            Confirm Booking
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full bg-transparent"
            onClick={(e) => {
              e.preventDefault()
              setShowDoctorBooking(false)
              setDoctorBookingDate("")
              setDoctorBookingTime("")
              setDoctorBookingReason("")
            }}
          >
            Cancel
          </Button>
        </div>
      </div>
    )
  }

  if (showDoctorConfirmation) {
    return (
      <div className="p-4 space-y-5">
        <div className="flex flex-col items-center justify-center py-8">
          <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-4">
            <Check className="w-8 h-8 text-accent" />
          </div>
          <h1 className="text-xl font-semibold mb-2">Home Visit Booked!</h1>
          <p className="text-sm text-muted-foreground text-center mb-6">
            Your home visit request has been submitted. A doctor will visit your location.
          </p>

          <Card className="p-4 w-full mb-6">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Location</span>
                <span className="font-medium text-right max-w-[60%]">{pickupAddress}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date</span>
                <span className="font-medium">{doctorBookingDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Time</span>
                <span className="font-medium">{doctorBookingTime}</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-muted-foreground">Reason</span>
                <span className="font-medium text-right max-w-[60%]">{doctorBookingReason}</span>
              </div>
            </div>
          </Card>

          <Button
            className="w-full"
            onClick={() => {
              // Add home visit to bookings
              const newBooking: Booking = {
                id: Date.now(),
                type: "Home Visit",
                pickup: pickupAddress,
                destination: pickupAddress, // Logical consistency: destination is the pickup
                date: doctorBookingDate,
                time: doctorBookingTime,
                status: "confirmed",
                driverOrDoctor: "Dr. Ong Pei Ling", // Changed to Doctor/Specialist
                phone: "+60 12-456 4307",
                vehicleOrService: "Home Visit Service", // Changed to Service
                trackingStatus: "requested",
                reason: doctorBookingReason,
              }
              setBookings((prev) => [newBooking, ...prev])
              setShowDoctorConfirmation(false)
              setShowDoctorBooking(false)
              setDoctorBookingDate("")
              setDoctorBookingTime("")
              setDoctorBookingReason("")
            }}
          >
            Done
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-5">
      {/* Header */}
      <header>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">Transport</h1>
            <p className="text-sm text-muted-foreground">Medical transportation services</p>
          </div>
          {isRuralMode && (
            <Badge className="bg-accent text-accent-foreground">
              <MapPin className="w-3 h-3 mr-1" /> Rural Mode
            </Badge>
          )}
        </div>
        {isRuralMode && location && (
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Location:</span>
            <span className="text-foreground font-medium text-right">{location}</span>
          </div>
        )}
      </header>

      {/* Quick Book */}
      <Card className="p-4 bg-primary text-primary-foreground">
        <h2 className="font-medium mb-2">Need a ride to your appointment?</h2>
        <p className="text-sm text-primary-foreground/80 mb-4">
          Book subsidized medical transport for your upcoming visits.
        </p>
        <Button variant="secondary" className="w-full" onClick={() => setShowBooking(true)}>
          <Car className="w-4 h-4 mr-2" /> Book Transport
        </Button>
      </Card>

      {/* Rural Mode - Doctor Booking */}
      {isRuralMode && (
        <Card className="p-4 bg-accent/10 border-accent/20">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
              <Stethoscope className="w-5 h-5 text-accent" />
            </div>
            <div className="flex-1">
              <h2 className="font-medium mb-1">Need a Doctor Home Visit?</h2>
              <p className="text-xs text-muted-foreground">
                Book a doctor to visit your rural location. Available for areas with limited hospital access.
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full bg-background hover:bg-accent/20"
            onClick={() => setShowDoctorBooking(true)}
          >
            <Stethoscope className="w-4 h-4 mr-2" /> Book Home Visit
          </Button>
        </Card>
      )}

      {/* Upcoming Bookings */}
      <section>
        <h2 className="text-sm font-medium text-muted-foreground mb-3">Upcoming Bookings</h2>
        {bookings.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">You have no upcoming bookings.</p>
        ) : (
            bookings.map((booking) => {
                const isHomeVisit = booking.type === "Home Visit"
                return (
                    <Card key={booking.id} className="p-4 mb-3">
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                                    {/* --- CORRECTED ICON LOGIC --- */}
                                    {getBookingIcon(booking.type)}
                                </div>
                                <div>
                                    <h3 className="font-medium">{booking.type}</h3>
                                    <p className="text-xs text-muted-foreground">{booking.vehicleOrService}</p>
                                </div>
                            </div>
                            <Badge className="bg-accent text-accent-foreground">Confirmed</Badge>
                        </div>

                        <div className="space-y-2 mb-4">
                            {isHomeVisit ? (
                                <>
                                    <div className="flex items-center gap-2 text-sm">
                                        <MapPin className="w-4 h-4 text-primary" />
                                        <span className="text-muted-foreground">Visit Location:</span>
                                        <span className="text-right max-w-[60%]">{booking.pickup}</span>
                                    </div>
                                    {booking.reason && (
                                        <div className="text-sm">
                                            <span className="text-muted-foreground">Reason: </span>
                                            <span className="text-right max-w-[60%]">{booking.reason}</span>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <>
                                    <div className="flex items-center gap-2 text-sm">
                                        <MapPin className="w-4 h-4 text-muted-foreground" />
                                        <span className="text-muted-foreground">From:</span>
                                        <span className="text-right max-w-[60%]">{booking.pickup}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <MapPin className="w-4 h-4 text-primary" />
                                        <span className="text-muted-foreground">To:</span>
                                        <span className="text-right max-w-[60%]">{booking.destination}</span>
                                    </div>
                                </>
                            )}
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" /> {booking.date}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" /> {booking.time}
                                </span>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Button
                                size="sm"
                                variant="outline"
                                className="flex-1 text-xs h-8 bg-transparent"
                                onClick={() => window.open(`tel:${booking.phone}`)}
                            >
                                <Phone className="w-3 h-3 mr-1" /> Call {isHomeVisit ? "Specialist" : "Driver"}
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                className="flex-1 text-xs h-8 bg-transparent"
                                onClick={() => handleTrack(booking.id)}
                            >
                                Track
                            </Button>
                        </div>
                    </Card>
                )
            })
        )}
      </section>

      <Card className="p-4 border-destructive/30 bg-destructive/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
            <Ambulance className="w-5 h-5 text-destructive" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-foreground">Emergency?</h3>
            <p className="text-xs text-muted-foreground">Call 999 for immediate assistance</p>
          </div>
          {showEmergencyConfirm ? (
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="text-xs bg-transparent"
                onClick={() => setShowEmergencyConfirm(false)}
              >
                Cancel
              </Button>
              <Button size="sm" variant="destructive" onClick={() => window.open("tel:999")}>
                Call 999
              </Button>
            </div>
          ) : (
            <Button size="sm" variant="destructive" onClick={() => setShowEmergencyConfirm(true)}>
              <Phone className="w-4 h-4" />
            </Button>
          )}
        </div>
      </Card>
    </div>
  )
}