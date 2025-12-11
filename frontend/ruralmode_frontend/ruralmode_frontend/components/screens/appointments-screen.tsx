"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, Plus, ChevronLeft, ChevronRight, Building2, Check } from "lucide-react"

const initialAppointments = [
  {
    id: 1,
    type: "General Checkup",
    doctor: "Dr. Tan Wei Ming",
    specialty: "General Practitioner",
    date: "Dec 15, 2025",
    time: "9:00 AM",
    location: "HUKM",
    status: "confirmed",
  },
  {
    id: 2,
    type: "Blood Test",
    doctor: "Lab Services",
    specialty: "Pathology",
    date: "Dec 18, 2025",
    time: "7:30 AM",
    location: "Hospital Kuala Lumpur",
    status: "pending",
  },
  {
    id: 3,
    type: "Follow-up",
    doctor: "Dr. Nur Aisyah",
    specialty: "Endocrinologist",
    date: "Dec 22, 2025",
    time: "2:00 PM",
    location: "PPUM",
    status: "confirmed",
  },
]

const pastAppointments = [
  {
    id: 4,
    type: "Eye Checkup",
    doctor: "Dr. Lim Mei Ling",
    specialty: "Ophthalmologist",
    date: "Nov 20, 2025",
    time: "10:00 AM",
    location: "HUKM",
    status: "completed",
  },
  {
    id: 5,
    type: "Diabetes Review",
    doctor: "Dr. Nur Aisyah",
    specialty: "Endocrinologist",
    date: "Oct 15, 2025",
    time: "2:30 PM",
    location: "PPUM",
    status: "completed",
  },
]

const cancelledAppointments = [
  {
    id: 6,
    type: "Dental Checkup",
    doctor: "Dr. Ahmad Faiz",
    specialty: "Dentist",
    date: "Nov 5, 2025",
    time: "3:00 PM",
    location: "Klinik Kesihatan Ampang",
    status: "cancelled",
  },
]

const hospitals = ["Hospital Kuala Lumpur", "HUKM", "PPUM", "Hospital Putrajaya", "Hospital Selayang"]

export function AppointmentsScreen() {
  const [showBooking, setShowBooking] = useState(false)
  const [selectedHospital, setSelectedHospital] = useState("")
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [currentMonth, setCurrentMonth] = useState(0) // 0 = Dec 2025, 1 = Jan 2026
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [activeTab, setActiveTab] = useState<"upcoming" | "past" | "cancelled">("upcoming")
  const [appointments, setAppointments] = useState(initialAppointments)
  const [rescheduleId, setRescheduleId] = useState<number | null>(null)
  const [showCancelConfirm, setShowCancelConfirm] = useState<number | null>(null)
  const [showReschedule, setShowReschedule] = useState(false) 
  const [appointmentToReschedule, setAppointmentToReschedule] = useState<Appointment | null>(null)
  const [showRescheduleConfirmation, setShowRescheduleConfirmation] = useState(false)

  const months = [
    { name: "December 2025", days: 31, startDay: 1, availableDates: [9, 10, 11, 15, 16, 17, 18, 22, 23, 24, 29, 30] },
    { name: "January 2026", days: 31, startDay: 4, availableDates: [6, 7, 8, 13, 14, 15, 20, 21, 22, 27, 28, 29] },
  ]

  const timeSlots = ["8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM", "4:00 PM"]

  const handleCancel = (id: number) => {
    setAppointments(appointments.filter((apt) => apt.id !== id))
    setShowCancelConfirm(null)
  }

  if (showConfirmation) {
    return (
      <div className="p-4 space-y-5">
        <div className="flex flex-col items-center justify-center py-8">
          <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-4">
            <Check className="w-8 h-8 text-accent" />
          </div>
          <h1 className="text-xl font-semibold mb-2">Booking Confirmed!</h1>
          <p className="text-sm text-muted-foreground text-center mb-6">
            Your appointment has been successfully booked.
          </p>

          <Card className="p-4 w-full mb-6">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Hospital</span>
                <span className="font-medium">{selectedHospital}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date</span>
                <span className="font-medium">{selectedDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Time</span>
                <span className="font-medium">{selectedTime}</span>
              </div>
            </div>
          </Card>

          <Button
            className="w-full"
            onClick={() => {
              setShowConfirmation(false)
              setShowBooking(false)
              setSelectedHospital("")
              setSelectedDate("")
              setSelectedTime("")
            }}
          >
            Done
          </Button>
        </div>
      </div>
    )
  }

  if (showReschedule) {
    if (!appointmentToReschedule) {
         // Fallback if state is missing
         return <div className="p-4">Error: Appointment details missing for rescheduling.</div>
    }

    const availableDates = [16, 17, 18, 19, 20, 22, 23]
    const timeSlots = ["8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM"]

    return (
        <div className="p-4 space-y-5">
            <header className="flex items-center gap-3">
                <button
                    onClick={() => setShowReschedule(false)} // Go back to the appointment list
                    className="p-2 -ml-2 rounded-full hover:bg-secondary transition-colors"
                >
                    <ChevronLeft className="w-5 h-5" /> 
                </button>
                <h1 className="text-lg font-semibold">
                    Reschedule: {appointmentToReschedule.type}
                </h1>
            </header>

            {/* Current Appointment Details Card */}
            <Card className="p-3 bg-secondary/50">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <p className="font-medium text-sm">{appointmentToReschedule.type}</p>
                        <p className="text-xs text-muted-foreground">
                            Currently: {appointmentToReschedule.date}, {appointmentToReschedule.time} at {appointmentToReschedule.location}
                        </p>
                    </div>
                </div>
            </Card>

            <section>
                <h2 className="text-sm font-medium text-muted-foreground mb-3">Select New Date</h2>
                <div className="grid grid-cols-4 gap-2">
                    {availableDates.map((date) => (
                        <Button
                            key={date}
                            variant={selectedDate === `Dec ${date}` ? "default" : "outline"}
                            size="sm"
                            className={selectedDate === `Dec ${date}` ? "" : "bg-transparent"}
                            onClick={() => setSelectedDate(`Dec ${date}`)}
                        >
                            Dec {date}
                        </Button>
                    ))}
                </div>
            </section>

            <section>
                <h2 className="text-sm font-medium text-muted-foreground mb-3">Select New Time</h2>
                <div className="grid grid-cols-3 gap-2">
                    {timeSlots.map((time) => (
                        <Button
                            key={time}
                            variant={selectedTime === time ? "default" : "outline"}
                            size="sm"
                            className={selectedTime === time ? "" : "bg-transparent"}
                            onClick={() => setSelectedTime(time)}
                        >
                            {time}
                        </Button>
                    ))}
                </div>
            </section>

            <Button
                className="w-full"
                disabled={!selectedDate || !selectedTime}
                onClick={() => {
                    // Update the main appointments list with the new date/time (Simulated API call)
                    const updatedAppointments = appointments.map(apt => 
                        apt.id === appointmentToReschedule.id 
                        ? { ...apt, date: selectedDate, time: selectedTime, status: 'pending' } // Set status to pending confirmation
                        : apt
                    );
                    setAppointments(updatedAppointments);

                    // Clear state and return to list view
                    setShowReschedule(false)
                    setAppointmentToReschedule(null)
                    setSelectedDate("")
                    setSelectedTime("")
                    setShowConfirmation(true);
                    
                    // You might want a dedicated Reschedule Confirmation screen here, 
                    // but for now, we'll just show the main list.
                }}
            >
                Confirm Reschedule
            </Button>
        </div>
    )
  }

  if (showConfirmation) {
    return (
      <div className="p-4 space-y-6 flex flex-col items-center text-center h-full">
      
        {/* 🚀 VISUAL SUCCESS HEADER */}
        <div className="mt-16 space-y-3">
          {/* Animated Icon Container (Use accent color for a success feel) */}
          <div className="w-18 h-18 rounded-full bg-accent text-accent-foreground flex items-center justify-center mx-auto shadow-lg">
            {/* Using Bell icon to represent notification/confirmation, or Calendar for appointment */}
            <Bell className="w-8 h-8" /> 
          </div>
        
          {/* Title: Stronger Font Weight */}
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
            Reschedule Request Sent
          </h1>
          {/* Message: Slightly larger and centered */}
          <p className="text-base text-muted-foreground max-w-sm mx-auto">
            Your request has been submitted. We will notify you once the doctor confirms the new slot.
          </p>
        </div>

        {/* 📝 CONFIRMATION DETAILS CARD */}
        <Card className="p-4 w-full max-w-md text-left border-2 border-primary/20 shadow-md">
          <h3 className="text-lg font-bold mb-3 text-primary">Request Details</h3> 
        
          <div className="text-sm space-y-2">
          
            {/* Appointment Type & Doctor */}
            <div className="flex justify-between items-center pb-2 border-b border-border/70">
              <span className="font-medium text-foreground">Appointment:</span>
              <span className="text-muted-foreground text-right"> Dr. Tan Wei Ming</span>
            </div>

            {/* New Date */}
            <div className="flex justify-between items-center py-1">
              <span className="font-medium text-foreground">New Date:</span>
              <span className="font-semibold text-primary">{selectedDate}</span>
            </div>
          
            {/* New Time */}
            <div className="flex justify-between items-center pt-1">
              <span className="font-medium text-foreground">New Time:</span>
              <span className="font-semibold text-primary">{selectedTime}</span>
            </div>
          
          </div>
        </Card>

        {/* 🏠 BUTTON */}
        <Button
          className="w-full max-w-md mt-10" // Added margin top for spacing
          onClick={() => {
            setShowConfirmation(false)
            setSelectedDate("") 
            setSelectedTime("")
            onNavigate("home")
          }}
        >
          Back to Home
        </Button>
      </div>
    )
  }

  if (showBooking) {
    const isRescheduling = rescheduleId !== null
    const currentMonthData = months[currentMonth]

    return (
      <div className="p-4 space-y-5">
        <header className="flex items-center gap-3">
          <button
            onClick={() => {
              setShowBooking(false)
              setRescheduleId(null)
            }}
            className="p-2 -ml-2 rounded-full hover:bg-secondary transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold">{isRescheduling ? "Reschedule Appointment" : "Book Appointment"}</h1>
        </header>

        {/* Hospital Selection */}
        <section>
          <h2 className="text-sm font-medium text-muted-foreground mb-3">Select Hospital</h2>
          <div className="space-y-2">
            {hospitals.map((hospital) => (
              <Card
                key={hospital}
                className={`p-3 cursor-pointer transition-all ${
                  selectedHospital === hospital ? "border-primary bg-primary/5" : "hover:bg-secondary"
                }`}
                onClick={() => setSelectedHospital(hospital)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-sm font-medium">{hospital}</span>
                  {selectedHospital === hospital && <Check className="w-4 h-4 text-primary ml-auto" />}
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-sm font-medium text-muted-foreground mb-3">Select Date</h2>
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <button
                className="p-1 rounded hover:bg-secondary disabled:opacity-50"
                onClick={() => setCurrentMonth(0)}
                disabled={currentMonth === 0}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-medium">{currentMonthData.name}</span>
              <button
                className="p-1 rounded hover:bg-secondary disabled:opacity-50"
                onClick={() => setCurrentMonth(1)}
                disabled={currentMonth === 1}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs">
              {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
                <div key={i} className="text-muted-foreground py-2">
                  {day}
                </div>
              ))}
              {/* Empty cells for start day offset */}
              {Array.from({ length: currentMonthData.startDay }, (_, i) => (
                <div key={`empty-${i}`} className="py-2" />
              ))}
              {Array.from({ length: currentMonthData.days }, (_, i) => i + 1).map((date) => {
                const isAvailable = currentMonthData.availableDates.includes(date)
                const dateStr = `${currentMonth === 0 ? "Dec" : "Jan"} ${date}`
                const isSelected = selectedDate === dateStr

                return (
                  <button
                    key={date}
                    onClick={() => isAvailable && setSelectedDate(dateStr)}
                    disabled={!isAvailable}
                    className={`py-2 rounded-lg transition-colors ${
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : isAvailable
                          ? "hover:bg-secondary"
                          : "text-muted-foreground/30 cursor-not-allowed"
                    }`}
                  >
                    {date}
                  </button>
                )
              })}
            </div>
            <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-primary" /> Available
              </span>
              <span className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-muted" /> Unavailable
              </span>
            </div>
          </Card>
        </section>

        <section>
          <h2 className="text-sm font-medium text-muted-foreground mb-3">Available Time Slots</h2>
          <div className="grid grid-cols-3 gap-2">
            {timeSlots.map((time) => (
              <Button
                key={time}
                variant={selectedTime === time ? "default" : "outline"}
                size="sm"
                className={`text-xs ${selectedTime === time ? "" : "bg-transparent"}`}
                onClick={() => setSelectedTime(time)}
              >
                {time}
              </Button>
            ))}
          </div>
        </section>

        <Button
          className="w-full"
          disabled={!selectedHospital || !selectedDate || !selectedTime}
          onClick={() => setShowConfirmation(true)}
        >
          Confirm Booking
        </Button>
      </div>
    )
  }

  const displayedAppointments =
    activeTab === "upcoming" ? appointments : activeTab === "past" ? pastAppointments : cancelledAppointments

  return (
    <div className="p-4 space-y-5">
      {/* Header */}
      <header className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Appointments</h1>
        <Button size="sm" onClick={() => setShowBooking(true)}>
          <Plus className="w-4 h-4 mr-1" /> Book
        </Button>
      </header>

      <div className="flex gap-2">
        <Badge
          variant={activeTab === "upcoming" ? "default" : "secondary"}
          className="cursor-pointer"
          onClick={() => setActiveTab("upcoming")}
        >
          Upcoming
        </Badge>
        <Badge
          variant={activeTab === "past" ? "default" : "secondary"}
          className="cursor-pointer"
          onClick={() => setActiveTab("past")}
        >
          Past
        </Badge>
        <Badge
          variant={activeTab === "cancelled" ? "default" : "secondary"}
          className="cursor-pointer"
          onClick={() => setActiveTab("cancelled")}
        >
          Cancelled
        </Badge>
      </div>

      {/* Appointments List */}
      <div className="space-y-3">
        {displayedAppointments.length === 0 ? (
          <Card className="p-6 text-center">
            <p className="text-muted-foreground">No {activeTab} appointments</p>
          </Card>
        ) : (
          displayedAppointments.map((apt) => (
            <Card key={apt.id} className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-medium text-foreground">{apt.type}</h3>
                  <p className="text-sm text-muted-foreground">{apt.doctor}</p>
                  <p className="text-xs text-muted-foreground">{apt.specialty}</p>
                </div>
                <Badge
                  variant={
                    apt.status === "confirmed" || apt.status === "completed"
                      ? "default"
                      : apt.status === "cancelled"
                        ? "destructive"
                        : "secondary"
                  }
                  className={
                    apt.status === "confirmed" || apt.status === "completed" ? "bg-accent text-accent-foreground" : ""
                  }
                >
                  {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> {apt.date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {apt.time}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {apt.location}
                </span>
              </div>
              {activeTab === "upcoming" && (
                <>
                  {showCancelConfirm === apt.id ? (
                    <div className="space-y-2">
                      <p className="text-sm text-center text-muted-foreground">Cancel this appointment?</p>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 text-xs h-8 bg-transparent"
                          onClick={() => setShowCancelConfirm(null)}
                        >
                          No, Keep
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="flex-1 text-xs h-8"
                          onClick={() => handleCancel(apt.id)}
                        >
                          Yes, Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 text-xs h-8 bg-transparent"
                        onClick={() => {
                          const aptToReschedule = appointments.find(a => a.id === apt.id);
                          if (aptToReschedule) {
                          setAppointmentToReschedule(aptToReschedule); // Save the appointment data
                          
                        // Pre-fill the form fields with the current appointment's data
                          setSelectedDate(aptToReschedule.date);
                          setSelectedTime(aptToReschedule.time);
        
                          setShowReschedule(true); // Trigger the display
                          }
                        }}
                      >
                        Reschedule
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 text-xs h-8 text-destructive hover:bg-destructive hover:text-destructive-foreground bg-transparent"
                        onClick={() => setShowCancelConfirm(apt.id)}
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
