"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Calendar,
  Clock,
  MapPin,
  ChevronRight,
  Plus,
  Check,
  X,
  ChevronLeft,
  Building2,
  Stethoscope,
  FlaskConical,
  ScanLine,
  Syringe,
  PersonStanding,
  Cross,
  Bell,
} from "lucide-react"
import {
  useAppointments,
  availableDates,
  availableTimeSlotsPerDate,
  allTimeSlots,
  appointmentCategories,
} from "@/contexts/appointments-context"

const hospitals = ["HUKM", "Hospital Kuala Lumpur", "PPUM", "Hospital Selayang", "Klinik Kesihatan Ampang"]

const categoryIcons: { [key: string]: React.ComponentType<{ className?: string }> } = {
  general: Stethoscope,
  specialist: Cross,
  laboratory: FlaskConical,
  imaging: ScanLine,
  dental: Cross,
  physiotherapy: PersonStanding,
  vaccination: Syringe,
}

export function AppointmentsScreen() {
  const {
    appointments,
    cancelledAppointments,
    pastAppointments,
    addAppointment,
    cancelAppointment,
    rescheduleAppointment,
  } = useAppointments()

  const [showBooking, setShowBooking] = useState(false)
  const [selectedHospital, setSelectedHospital] = useState("")
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [currentMonth, setCurrentMonth] = useState(0)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [activeTab, setActiveTab] = useState<"upcoming" | "past" | "cancelled">("upcoming")
  const [showCancelConfirm, setShowCancelConfirm] = useState<number | null>(null)
  const [showReschedule, setShowReschedule] = useState(false)
  const [appointmentToReschedule, setAppointmentToReschedule] = useState<(typeof appointments)[0] | null>(null)
  const [showRescheduleSuccess, setShowRescheduleSuccess] = useState(false)
  const [rescheduledDetails, setRescheduledDetails] = useState({ date: "", time: "", type: "" })

  const months = [
    { name: "December 2025", key: "Dec 2025", days: 31, startDay: 1 },
    { name: "January 2026", key: "Jan 2026", days: 31, startDay: 4 },
  ]

  const currentMonthData = months[currentMonth]
  const monthAvailableDates = availableDates[currentMonthData.key] || []

  const handleCancelAppointment = (id: number) => {
    cancelAppointment(id)
    setShowCancelConfirm(null)
  }

  const handleOpenReschedule = (apt: (typeof appointments)[0]) => {
    setAppointmentToReschedule(apt)
    setSelectedDate("")
    setSelectedTime("")
    setShowReschedule(true)
  }

  const handleDateSelect = (dateStr: string) => {
    setSelectedDate(dateStr)
    setSelectedTime("") // Reset time when date changes
  }

  if (showRescheduleSuccess) {
    return (
      <div className="p-4 space-y-6 flex flex-col items-center text-center h-full">
        <div className="mt-16 space-y-3">
          <div className="w-18 h-18 rounded-full bg-accent text-accent-foreground flex items-center justify-center mx-auto shadow-lg">
            <Bell className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Reschedule Request Sent</h1>
          <p className="text-base text-muted-foreground max-w-sm mx-auto">
            Your request has been submitted. We will notify you once the doctor confirms the new slot.
          </p>
        </div>

        <Card className="p-4 w-full max-w-md text-left border-2 border-primary/20 shadow-md">
          <h3 className="text-lg font-bold mb-3 text-primary">Request Details</h3>
          <div className="text-sm space-y-2">
            <div className="flex justify-between items-center pb-2 border-b border-border/70">
              <span className="font-medium text-foreground">Appointment:</span>
              <span className="text-muted-foreground text-right">{rescheduledDetails.type}</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="font-medium text-foreground">New Date:</span>
              <span className="font-semibold text-primary">{rescheduledDetails.date}</span>
            </div>
            <div className="flex justify-between items-center pt-1">
              <span className="font-medium text-foreground">New Time:</span>
              <span className="font-semibold text-primary">{rescheduledDetails.time}</span>
            </div>
          </div>
        </Card>

        <Button
          className="w-full max-w-md mt-10"
          onClick={() => {
            setShowRescheduleSuccess(false)
            setRescheduledDetails({ date: "", time: "", type: "" })
          }}
        >
          Back to Appointments
        </Button>
      </div>
    )
  }

  if (showConfirmation) {
    const categoryName = appointmentCategories.find((c) => c.id === selectedCategory)?.name || "General"
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
                <span className="text-muted-foreground">Category</span>
                <span className="font-medium">{categoryName}</span>
              </div>
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
              addAppointment({
                id: Date.now(),
                type: categoryName,
                category: selectedCategory,
                doctor: "To be assigned",
                specialty: categoryName,
                date: selectedDate,
                time: selectedTime,
                location: selectedHospital,
                status: "pending",
                hasTransport: false,
              })
              setShowConfirmation(false)
              setShowBooking(false)
              setSelectedHospital("")
              setSelectedDate("")
              setSelectedTime("")
              setSelectedCategory("")
            }}
          >
            Done
          </Button>
        </div>
      </div>
    )
  }

  if (showReschedule && appointmentToReschedule) {
    const currentMonthData = months[currentMonth]
    const monthAvailableDates = availableDates[currentMonthData.key] || []
    const availableTimesForDate = selectedDate ? availableTimeSlotsPerDate[selectedDate] || [] : []

    return (
      <div className="p-4 space-y-5">
        <header className="flex items-center gap-3">
          <button
            onClick={() => {
              setShowReschedule(false)
              setAppointmentToReschedule(null)
              setSelectedDate("")
              setSelectedTime("")
            }}
            className="p-2 -ml-2 rounded-full hover:bg-secondary transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold">Reschedule: {appointmentToReschedule.type}</h1>
        </header>

        <Card className="p-3 bg-secondary/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-medium text-sm">{appointmentToReschedule.type}</p>
              <p className="text-xs text-muted-foreground">
                Currently: {appointmentToReschedule.date}, {appointmentToReschedule.time} at{" "}
                {appointmentToReschedule.location}
              </p>
            </div>
          </div>
        </Card>

        {/* Calendar with only available dates */}
        <section>
          <h2 className="text-sm font-medium text-muted-foreground mb-3">Select New Date</h2>
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
              {Array.from({ length: currentMonthData.startDay }, (_, i) => (
                <div key={`empty-${i}`} className="py-2" />
              ))}
              {Array.from({ length: currentMonthData.days }, (_, i) => i + 1).map((date) => {
                const isAvailable = monthAvailableDates.includes(date)
                const dateStr = `${currentMonth === 0 ? "Dec" : "Jan"} ${date}, ${currentMonth === 0 ? "2025" : "2026"}`
                const isSelected = selectedDate === dateStr

                return (
                  <button
                    key={date}
                    onClick={() => isAvailable && handleDateSelect(dateStr)}
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
          <h2 className="text-sm font-medium text-muted-foreground mb-3">Select New Time</h2>
          <div className="grid grid-cols-3 gap-2">
            {allTimeSlots.map((time) => {
              const isAvailable = availableTimesForDate.includes(time)
              return (
                <Button
                  key={time}
                  variant={selectedTime === time ? "default" : "outline"}
                  size="sm"
                  className={
                    selectedTime === time
                      ? ""
                      : isAvailable
                        ? "bg-transparent"
                        : "bg-transparent opacity-40 cursor-not-allowed"
                  }
                  onClick={() => isAvailable && setSelectedTime(time)}
                  disabled={!isAvailable}
                >
                  {time}
                </Button>
              )
            })}
          </div>
          {!selectedDate && (
            <p className="text-xs text-muted-foreground mt-2">Please select a date first to see available times</p>
          )}
        </section>

        <Button
          className="w-full"
          disabled={!selectedDate || !selectedTime}
          onClick={() => {
            rescheduleAppointment(appointmentToReschedule.id, selectedDate, selectedTime)
            setRescheduledDetails({
              date: selectedDate,
              time: selectedTime,
              type: appointmentToReschedule.type,
            })
            setShowReschedule(false)
            setAppointmentToReschedule(null)
            setSelectedDate("")
            setSelectedTime("")
            setShowRescheduleSuccess(true)
          }}
        >
          Confirm Reschedule
        </Button>
      </div>
    )
  }

  if (showBooking) {
    const currentMonthData = months[currentMonth]
    const monthAvailableDates = availableDates[currentMonthData.key] || []
    const availableTimesForDate = selectedDate ? availableTimeSlotsPerDate[selectedDate] || [] : []

    return (
      <div className="p-4 space-y-5">
        <header className="flex items-center gap-3">
          <button
            onClick={() => setShowBooking(false)}
            className="p-2 -ml-2 rounded-full hover:bg-secondary transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold">Book Appointment</h1>
        </header>

        {/* Category Selection */}
        <section>
          <h2 className="text-sm font-medium text-muted-foreground mb-3">Select Category</h2>
          <div className="grid grid-cols-2 gap-2">
            {appointmentCategories.map((cat) => {
              const IconComponent = categoryIcons[cat.id] || Stethoscope
              return (
                <Card
                  key={cat.id}
                  className={`p-3 cursor-pointer transition-all ${
                    selectedCategory === cat.id ? "border-primary bg-primary/5" : "hover:bg-secondary"
                  }`}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <IconComponent className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-xs font-medium">{cat.name}</span>
                    {selectedCategory === cat.id && <Check className="w-3 h-3 text-primary ml-auto" />}
                  </div>
                </Card>
              )
            })}
          </div>
        </section>

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
                  <span className="font-medium text-sm">{hospital}</span>
                  {selectedHospital === hospital && <Check className="w-4 h-4 text-primary ml-auto" />}
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Calendar with only available dates */}
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
              {Array.from({ length: currentMonthData.startDay }, (_, i) => (
                <div key={`empty-${i}`} className="py-2" />
              ))}
              {Array.from({ length: currentMonthData.days }, (_, i) => i + 1).map((date) => {
                const isAvailable = monthAvailableDates.includes(date)
                const dateStr = `${currentMonth === 0 ? "Dec" : "Jan"} ${date}, ${currentMonth === 0 ? "2025" : "2026"}`
                const isSelected = selectedDate === dateStr

                return (
                  <button
                    key={date}
                    onClick={() => isAvailable && handleDateSelect(dateStr)}
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
            {allTimeSlots.map((time) => {
              const isAvailable = availableTimesForDate.includes(time)
              return (
                <Button
                  key={time}
                  variant={selectedTime === time ? "default" : "outline"}
                  size="sm"
                  className={`text-xs ${
                    selectedTime === time
                      ? ""
                      : isAvailable
                        ? "bg-transparent"
                        : "bg-transparent opacity-40 cursor-not-allowed"
                  }`}
                  onClick={() => isAvailable && setSelectedTime(time)}
                  disabled={!isAvailable}
                >
                  {time}
                </Button>
              )
            })}
          </div>
          {!selectedDate && (
            <p className="text-xs text-muted-foreground mt-2">Please select a date first to see available times</p>
          )}
        </section>

        <Button
          className="w-full"
          disabled={!selectedCategory || !selectedHospital || !selectedDate || !selectedTime}
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
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">Appointments</h1>
          <p className="text-sm text-muted-foreground">Manage your appointments</p>
        </div>
        <Button size="sm" onClick={() => setShowBooking(true)}>
          <Plus className="w-4 h-4 mr-1" /> Book
        </Button>
      </header>

      {/* Tabs */}
      <div className="flex gap-2">
        {(["upcoming", "past", "cancelled"] as const).map((tab) => (
          <Button
            key={tab}
            size="sm"
            variant={activeTab === tab ? "default" : "outline"}
            className={activeTab !== tab ? "bg-transparent" : ""}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </Button>
        ))}
      </div>

      {/* Appointments List */}
      <div className="space-y-3">
        {displayedAppointments.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No {activeTab} appointments</p>
          </Card>
        ) : (
          displayedAppointments.map((apt) => (
            <Card key={apt.id} className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">{apt.type}</h3>
                      <p className="text-xs text-muted-foreground">{apt.doctor}</p>
                    </div>
                    <Badge
                      variant={
                        apt.status === "confirmed"
                          ? "default"
                          : apt.status === "completed"
                            ? "default"
                            : apt.status === "cancelled"
                              ? "destructive"
                              : apt.status === "pending reschedule"
                                ? "outline"
                                : "secondary"
                      }
                      className={
                        apt.status === "confirmed"
                          ? "bg-green-500 text-white"
                          : apt.status === "completed"
                            ? "bg-green-500 text-white"
                            : apt.status === "pending reschedule"
                              ? "bg-yellow-500/20 text-yellow-700 border-yellow-500"
                              : ""
                      }
                    >
                      {apt.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {apt.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {apt.time}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3" /> {apt.location}
                  </div>

                  {activeTab === "upcoming" && apt.status !== "cancelled" && (
                    <div className="flex gap-2 mt-3">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 bg-transparent"
                        onClick={() => handleOpenReschedule(apt)}
                      >
                        Reschedule
                      </Button>
                      {showCancelConfirm === apt.id ? (
                        <div className="flex gap-1 flex-1">
                          <Button
                            size="sm"
                            variant="destructive"
                            className="flex-1"
                            onClick={() => handleCancelAppointment(apt.id)}
                          >
                            <Check className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 bg-transparent"
                            onClick={() => setShowCancelConfirm(null)}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 text-destructive border-destructive bg-transparent hover:bg-destructive/90"
                          onClick={() => setShowCancelConfirm(apt.id)}
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
