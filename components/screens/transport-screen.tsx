"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Car, MapPin, Clock, Phone, Calendar, Navigation, Ambulance, Bus, ChevronLeft, Check, User } from "lucide-react"

const appointmentsWithoutTransport = [
  { id: 1, type: "General Checkup", date: "Dec 15, 2025", time: "9:00 AM", location: "HUKM" },
  { id: 2, type: "Blood Test", date: "Dec 18, 2025", time: "7:30 AM", location: "Hospital Kuala Lumpur" },
  { id: 3, type: "Follow-up", date: "Dec 22, 2025", time: "2:00 PM", location: "PPUM" },
]

const initialBookings = [
  {
    id: 1,
    type: "Scheduled Pickup",
    pickup: "No. 123, Jalan Ampang, KL",
    destination: "HUKM",
    date: "Dec 15, 2025",
    time: "8:00 AM",
    status: "confirmed",
    driver: "Encik Razak",
    phone: "+60 12-345 6789",
    vehicle: "Toyota Vios - WXY 1234",
    trackingStatus: "requested", // requested, assigned, arrived
  },
]

export function TransportScreen() {
  const [showBooking, setShowBooking] = useState(false)
  const [transportType, setTransportType] = useState<"regular" | "ambulance" | "public">("regular")
  const [bookings, setBookings] = useState(initialBookings)
  const [selectedAppointment, setSelectedAppointment] = useState<(typeof appointmentsWithoutTransport)[0] | null>(null)
  const [selectedRequirements, setSelectedRequirements] = useState<string[]>([])
  const [specialNotes, setSpecialNotes] = useState("")
  const [pickupAddress, setPickupAddress] = useState("No. 123, Jalan Ampang, KL")
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [trackingId, setTrackingId] = useState<number | null>(null)
  const [showEmergencyConfirm, setShowEmergencyConfirm] = useState(false)

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

    const steps = [
      { key: "requested", label: "Requested", desc: "Waiting for driver assignment" },
      { key: "assigned", label: "Driver Assigned", desc: "Driver is on the way" },
      { key: "arrived", label: "Driver Arrived", desc: "Driver has arrived at pickup" },
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

        {/* Driver Info - Show when assigned */}
        {booking.trackingStatus !== "requested" && (
          <Card className="p-4">
            <h2 className="text-sm font-medium text-muted-foreground mb-3">Driver Information</h2>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="font-medium">{booking.driver}</p>
                <p className="text-sm text-muted-foreground">{booking.vehicle}</p>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full bg-transparent"
              onClick={() => window.open(`tel:${booking.phone}`)}
            >
              <Phone className="w-4 h-4 mr-2" /> Call Driver ({booking.phone})
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
                <span className="font-medium capitalize">{transportType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Pickup</span>
                <span className="font-medium">{pickupAddress}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Destination</span>
                <span className="font-medium">{selectedAppointment?.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date</span>
                <span className="font-medium">{selectedAppointment?.date}</span>
              </div>
              {selectedRequirements.length > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Requirements</span>
                  <span className="font-medium">{selectedRequirements.join(", ")}</span>
                </div>
              )}
            </div>
          </Card>

          <Button
            className="w-full"
            onClick={() => {
              setShowConfirmation(false)
              setShowBooking(false)
              setSelectedAppointment(null)
              setSelectedRequirements([])
              setSpecialNotes("")
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
            <Card
              className={`p-3 cursor-pointer text-center transition-all ${
                transportType === "public" ? "border-primary bg-primary/5" : ""
              }`}
              onClick={() => setTransportType("public")}
            >
              <Bus className="w-6 h-6 mx-auto mb-2 text-accent" />
              <span className="text-xs font-medium">Public</span>
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
                    <p className="text-xs text-muted-foreground">{apt.location}</p>
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
          <Button variant="outline" className="w-full bg-transparent" onClick={() => setShowBooking(false)}>
            Cancel
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-5">
      {/* Header */}
      <header>
        <h1 className="text-lg font-semibold">Transport</h1>
        <p className="text-sm text-muted-foreground">Medical transportation services</p>
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

      {/* Upcoming Bookings */}
      <section>
        <h2 className="text-sm font-medium text-muted-foreground mb-3">Upcoming Bookings</h2>
        {bookings.map((booking) => (
          <Card key={booking.id} className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                  <Car className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-medium">{booking.type}</h3>
                  <p className="text-xs text-muted-foreground">{booking.vehicle}</p>
                </div>
              </div>
              <Badge className="bg-accent text-accent-foreground">Confirmed</Badge>
            </div>

            <div className="space-y-2 mb-4">
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
                <Phone className="w-3 h-3 mr-1" /> Call Driver
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
        ))}
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
