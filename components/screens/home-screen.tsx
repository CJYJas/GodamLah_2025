"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/contexts/language-context"
import {
  useAppointments,
  availableDates,
  availableTimeSlotsPerDate,
  allTimeSlots,
} from "@/contexts/appointments-context"
import type { Screen } from "@/app/page"
import { Calendar, Car, Pill, FileText, Bell, ChevronRight, Clock, MapPin, AlertCircle, Menu } from "lucide-react"

interface HomeScreenProps {
  onNavigate: (screen: Screen) => void
  onOpenSidebar: () => void
}

const notificationsData = [
  {
    id: 1,
    title: "Appointment Reminder",
    message: "Your appointment with Dr. Tan is tomorrow at 9:00 AM",
    time: "2 hours ago",
    read: false,
  },
  {
    id: 2,
    title: "Medicine Refill",
    message: "Metformin supply is running low. Request refill soon.",
    time: "5 hours ago",
    read: false,
  },
  {
    id: 3,
    title: "Transport Confirmed",
    message: "Your transport for Dec 15 has been confirmed.",
    time: "1 day ago",
    read: true,
  },
]

export function HomeScreen({ onNavigate, onOpenSidebar }: HomeScreenProps) {
  const { t } = useLanguage()
  const { appointments, rescheduleAppointment } = useAppointments()
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState(notificationsData)
  const [showAppointmentDetail, setShowAppointmentDetail] = useState(false)
  const [showReschedule, setShowReschedule] = useState(false)
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(0)

  const upcomingAppointment = appointments[0]

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
  }

  const months = [
    { name: "December 2025", key: "Dec 2025", days: 31, startDay: 1 },
    { name: "January 2026", key: "Jan 2026", days: 31, startDay: 4 },
  ]

  if (showNotifications) {
    return (
      <div className="p-4 space-y-5">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowNotifications(false)}
              className="p-2 -ml-2 rounded-full hover:bg-secondary transition-colors"
            >
              <ChevronRight className="w-5 h-5 rotate-180" />
            </button>
            <h1 className="text-lg font-semibold">{t("notifications") || "Notifications"}</h1>
          </div>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllRead} className="text-xs">
              Mark all read
            </Button>
          )}
        </header>

        <div className="space-y-3">
          {notifications.map((notification) => (
            <Card key={notification.id} className={`p-4 ${!notification.read ? "border-primary/30 bg-primary/5" : ""}`}>
              <div className="flex items-start gap-3">
                <div className={`w-2 h-2 rounded-full mt-2 ${!notification.read ? "bg-primary" : "bg-transparent"}`} />
                <div className="flex-1">
                  <h3 className="font-medium text-sm">{notification.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
                  <p className="text-xs text-muted-foreground/60 mt-2">{notification.time}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (showAppointmentDetail && upcomingAppointment) {
    return (
      <div className="p-4 space-y-5">
        <header className="flex items-center gap-3">
          <button
            onClick={() => setShowAppointmentDetail(false)}
            className="p-2 -ml-2 rounded-full hover:bg-secondary transition-colors"
          >
            <ChevronRight className="w-5 h-5 rotate-180" />
          </button>
          <h1 className="text-lg font-semibold">{t("viewDetails")}</h1>
        </header>

        <Card className="p-4">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
              <Calendar className="w-7 h-7 text-accent" />
            </div>
            <div>
              <Badge
                className={
                  upcomingAppointment.status === "pending reschedule"
                    ? "mb-1 bg-amber-500 text-white"
                    : "mb-1 bg-green-500 text-white"
                }
              >
                {upcomingAppointment.status === "pending reschedule" ? "Pending Reschedule" : "Confirmed"}
              </Badge>
              <h2 className="text-lg font-semibold">{upcomingAppointment.type}</h2>
              <p className="text-sm text-muted-foreground">{upcomingAppointment.doctor}</p>
            </div>
          </div>

          <div className="space-y-3 mb-4">
            <div className="flex items-center gap-3 text-sm">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span>{upcomingAppointment.date}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span>{upcomingAppointment.time}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span>{upcomingAppointment.location} - Level 3, Room 302</span>
            </div>
          </div>

          <div className="bg-secondary/50 rounded-lg p-3 mb-4">
            <h3 className="text-sm font-medium mb-1">Notes</h3>
            <p className="text-xs text-muted-foreground">
              Regular checkup for diabetes management. Please bring previous lab results.
            </p>
          </div>
        </Card>

        <div className="flex gap-2">
          <Button
            className="flex-1"
            onClick={() => {
              setShowAppointmentDetail(false)
              setShowReschedule(true)
            }}
          >
            {t("reschedule")}
          </Button>
          <Button
            variant="outline"
            className="flex-1 bg-transparent text-destructive hover:bg-destructive hover:text-destructive-foreground"
          >
            Cancel
          </Button>
        </div>
      </div>
    )
  }

  if (showConfirmation && upcomingAppointment) {
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
              <span className="text-muted-foreground text-right">{upcomingAppointment.doctor}</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="font-medium text-foreground">New Date:</span>
              <span className="font-semibold text-primary">{selectedDate}</span>
            </div>
            <div className="flex justify-between items-center pt-1">
              <span className="font-medium text-foreground">New Time:</span>
              <span className="font-semibold text-primary">{selectedTime}</span>
            </div>
          </div>
        </Card>

        <Button
          className="w-full max-w-md mt-10"
          onClick={() => {
            setShowConfirmation(false)
            setSelectedDate("")
            setSelectedTime("")
          }}
        >
          Back to Home
        </Button>
      </div>
    )
  }

  if (showReschedule && upcomingAppointment) {
    const currentMonthData = months[currentMonth]
    const monthAvailableDates = availableDates[currentMonthData.key] || []

    return (
      <div className="p-4 space-y-5">
        <header className="flex items-center gap-3">
          <button
            onClick={() => setShowReschedule(false)}
            className="p-2 -ml-2 rounded-full hover:bg-secondary transition-colors"
          >
            <ChevronRight className="w-5 h-5 rotate-180" />
          </button>
          <h1 className="text-lg font-semibold">{t("reschedule")}</h1>
        </header>

        <Card className="p-3 bg-secondary/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-medium text-sm">{upcomingAppointment.type}</p>
              <p className="text-xs text-muted-foreground">
                Currently: {upcomingAppointment.date}, {upcomingAppointment.time}
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
                <ChevronRight className="w-4 h-4 rotate-180" />
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

        {/* Only available time slots */}
        <section>
          <h2 className="text-sm font-medium text-muted-foreground mb-3">Select New Time</h2>
          <div className="grid grid-cols-3 gap-2">
            {allTimeSlots.map((time) => {
              const availableForDate = selectedDate ? availableTimeSlotsPerDate[selectedDate] || [] : []
              const isAvailable = selectedDate && availableForDate.includes(time)

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
          {!selectedDate && <p className="text-xs text-muted-foreground mt-2">Please select a date first</p>}
        </section>

        <Button
          className="w-full"
          disabled={!selectedDate || !selectedTime}
          onClick={() => {
            rescheduleAppointment(upcomingAppointment.id, selectedDate, selectedTime)
            setShowReschedule(false)
            setShowConfirmation(true)
          }}
        >
          Confirm Reschedule
        </Button>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-5">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenSidebar}
            className="p-2 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
          >
            <Menu className="w-5 h-5 text-foreground" />
          </button>
          <div>
            <p className="text-sm text-muted-foreground">{t("welcome")}</p>
            <h1 className="text-xl font-semibold text-foreground">Ahmad bin Hassan</h1>
          </div>
        </div>
        <button
          onClick={() => setShowNotifications(true)}
          className="relative p-2 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
        >
          <Bell className="w-5 h-5 text-foreground" />
          {unreadCount > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />}
        </button>
      </header>

      {/* Quick Stats Card */}
      <Card className="p-4 bg-primary text-primary-foreground">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-medium">{t("healthSummary")}</h2>
          <Badge
            variant="secondary"
            className="bg-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/30"
          >
            IC: 850612-01-5234
          </Badge>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-primary-foreground/10 rounded-lg p-3">
            <p className="text-xs text-primary-foreground/80">{t("nextAppointment")}</p>
            <p className="font-semibold text-sm">{upcomingAppointment?.date.split(",")[0] || "None"}</p>
          </div>
          <div className="bg-primary-foreground/10 rounded-lg p-3">
            <p className="text-xs text-primary-foreground/80">{t("activePrescriptions")}</p>
            <p className="font-semibold text-sm">3 {t("medications")}</p>
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <section>
        <h2 className="text-sm font-medium text-muted-foreground mb-3">{t("quickActions")}</h2>
        <div className="grid grid-cols-4 gap-3">
          <QuickActionButton icon={Calendar} label={t("book")} onClick={() => onNavigate("appointments")} />
          <QuickActionButton icon={Car} label={t("transport")} onClick={() => onNavigate("transport")} />
          <QuickActionButton icon={Pill} label={t("refill")} onClick={() => onNavigate("medicine")} />
          <QuickActionButton icon={FileText} label={t("records")} onClick={() => onNavigate("records")} />
        </div>
      </section>

      {/* Upcoming Appointment - uses shared state */}
      {upcomingAppointment && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium text-muted-foreground">{t("upcomingAppointment")}</h2>
            <button
              onClick={() => onNavigate("appointments")}
              className="text-xs text-primary font-medium flex items-center gap-0.5"
            >
              {t("viewAll")} <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <Card className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                <Calendar className="w-6 h-6 text-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-foreground">{upcomingAppointment.type}</h3>
                  {upcomingAppointment.status === "pending reschedule" && (
                    <Badge className="bg-amber-500 text-white text-xs">Pending</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{upcomingAppointment.doctor}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {upcomingAppointment.date}, {upcomingAppointment.time}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {upcomingAppointment.location}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button size="sm" className="flex-1 text-xs h-9" onClick={() => setShowAppointmentDetail(true)}>
                {t("viewDetails")}
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-1 text-xs h-9 bg-transparent"
                onClick={() => setShowReschedule(true)}
              >
                {t("reschedule")}
              </Button>
            </div>
          </Card>
        </section>
      )}

      {/* Medicine Reminders */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-medium text-muted-foreground">{t("medicineReminders")}</h2>
          <button
            onClick={() => onNavigate("medicine")}
            className="text-xs text-primary font-medium flex items-center gap-0.5"
          >
            {t("viewAll")} <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        <div className="space-y-2">
          <MedicineReminderCard name="Metformin 500mg" time="8:00 AM" status="taken" />
          <MedicineReminderCard name="Amlodipine 5mg" time="2:00 PM" status="upcoming" />
        </div>
      </section>

      {/* Alert Banner */}
      <Card className="p-3 bg-destructive/10 border-destructive/20">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground">{t("refillNeeded")}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Your Metformin supply is running low. Request a refill before Dec 20.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}

function QuickActionButton({
  icon: Icon,
  label,
  onClick,
}: {
  icon: typeof Calendar
  label: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-2 p-3 rounded-xl bg-card border border-border hover:bg-secondary transition-colors"
    >
      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <span className="text-xs font-medium text-foreground">{label}</span>
    </button>
  )
}

function MedicineReminderCard({
  name,
  time,
  status,
}: {
  name: string
  time: string
  status: "taken" | "upcoming" | "missed"
}) {
  const { t } = useLanguage()

  return (
    <Card className="p-3 flex items-center gap-3">
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center ${
          status === "taken" ? "bg-accent/10" : status === "missed" ? "bg-destructive/10" : "bg-primary/10"
        }`}
      >
        <Pill
          className={`w-5 h-5 ${
            status === "taken" ? "text-accent" : status === "missed" ? "text-destructive" : "text-primary"
          }`}
        />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-foreground">{name}</p>
        <p className="text-xs text-muted-foreground">{time}</p>
      </div>
      <Badge
        variant={status === "taken" ? "default" : status === "missed" ? "destructive" : "secondary"}
        className={status === "taken" ? "bg-accent text-accent-foreground" : ""}
      >
        {status === "taken" ? t("taken") : status === "missed" ? t("missed") : t("upcoming")}
      </Badge>
    </Card>
  )
}
