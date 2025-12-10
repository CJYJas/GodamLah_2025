"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export interface Appointment {
  id: number
  type: string
  category: string
  doctor: string
  specialty: string
  date: string
  time: string
  location: string
  status: string
  hasTransport?: boolean
}

interface AppointmentsContextType {
  appointments: Appointment[]
  cancelledAppointments: Appointment[]
  pastAppointments: Appointment[]
  addAppointment: (appointment: Appointment) => void
  cancelAppointment: (id: number) => void
  rescheduleAppointment: (id: number, newDate: string, newTime: string) => void
  markTransportBooked: (id: number) => void
  getAppointmentsWithoutTransport: () => Appointment[]
}

const AppointmentsContext = createContext<AppointmentsContextType | undefined>(undefined)

const initialAppointments: Appointment[] = [
  {
    id: 1,
    type: "General Checkup",
    category: "General Medicine",
    doctor: "Dr. Tan Wei Ming",
    specialty: "General Practitioner",
    date: "Dec 15, 2025",
    time: "9:00 AM",
    location: "HUKM",
    status: "confirmed",
    hasTransport: true,
  },
  {
    id: 2,
    type: "Blood Test",
    category: "Laboratory",
    doctor: "Lab Services",
    specialty: "Pathology",
    date: "Dec 18, 2025",
    time: "7:30 AM",
    location: "Hospital Kuala Lumpur",
    status: "pending",
    hasTransport: false,
  },
  {
    id: 3,
    type: "Follow-up",
    category: "Specialist",
    doctor: "Dr. Nur Aisyah",
    specialty: "Endocrinologist",
    date: "Dec 22, 2025",
    time: "2:00 PM",
    location: "PPUM",
    status: "confirmed",
    hasTransport: false,
  },
]

const initialPastAppointments: Appointment[] = [
  {
    id: 4,
    type: "Eye Checkup",
    category: "Specialist",
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
    category: "Specialist",
    doctor: "Dr. Nur Aisyah",
    specialty: "Endocrinologist",
    date: "Oct 15, 2025",
    time: "2:30 PM",
    location: "PPUM",
    status: "completed",
  },
]

const initialCancelledAppointments: Appointment[] = [
  {
    id: 6,
    type: "Dental Checkup",
    category: "Dental",
    doctor: "Dr. Ahmad Faiz",
    specialty: "Dentist",
    date: "Nov 5, 2025",
    time: "3:00 PM",
    location: "Klinik Kesihatan Ampang",
    status: "cancelled",
  },
]

export function AppointmentsProvider({ children }: { children: ReactNode }) {
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments)
  const [cancelledAppointments, setCancelledAppointments] = useState<Appointment[]>(initialCancelledAppointments)
  const [pastAppointments] = useState<Appointment[]>(initialPastAppointments)

  const addAppointment = (appointment: Appointment) => {
    setAppointments((prev) => [...prev, appointment])
  }

  const cancelAppointment = (id: number) => {
    const appointmentToCancel = appointments.find((apt) => apt.id === id)
    if (appointmentToCancel) {
      setCancelledAppointments((prev) => [...prev, { ...appointmentToCancel, status: "cancelled" }])
      setAppointments((prev) => prev.filter((apt) => apt.id !== id))
    }
  }

  const rescheduleAppointment = (id: number, newDate: string, newTime: string) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, date: newDate, time: newTime, status: "pending reschedule" } : apt)),
    )
  }

  const markTransportBooked = (id: number) => {
    setAppointments((prev) => prev.map((apt) => (apt.id === id ? { ...apt, hasTransport: true } : apt)))
  }

  const getAppointmentsWithoutTransport = () => {
    return appointments.filter((apt) => !apt.hasTransport && apt.status !== "cancelled")
  }

  return (
    <AppointmentsContext.Provider
      value={{
        appointments,
        cancelledAppointments,
        pastAppointments,
        addAppointment,
        cancelAppointment,
        rescheduleAppointment,
        markTransportBooked,
        getAppointmentsWithoutTransport,
      }}
    >
      {children}
    </AppointmentsContext.Provider>
  )
}

export function useAppointments() {
  const context = useContext(AppointmentsContext)
  if (!context) {
    throw new Error("useAppointments must be used within an AppointmentsProvider")
  }
  return context
}

export const availableDates: { [key: string]: number[] } = {
  "Dec 2025": [12, 13, 15, 16, 17, 18, 19, 22, 23, 24, 26, 29, 30, 31],
  "Jan 2026": [2, 3, 6, 7, 8, 9, 13, 14, 15, 16, 20, 21, 22, 23, 27, 28, 29, 30],
}

export const availableTimeSlotsPerDate: { [key: string]: string[] } = {
  "Dec 12, 2025": ["9:00 AM", "10:00 AM", "2:00 PM", "3:00 PM"],
  "Dec 13, 2025": ["8:00 AM", "9:00 AM", "11:00 AM", "2:00 PM"],
  "Dec 15, 2025": ["8:00 AM", "10:00 AM", "11:00 AM", "3:00 PM", "4:00 PM"],
  "Dec 16, 2025": ["9:00 AM", "10:00 AM", "2:00 PM"],
  "Dec 17, 2025": ["8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM", "4:00 PM"],
  "Dec 18, 2025": ["8:00 AM", "11:00 AM", "3:00 PM", "4:00 PM"],
  "Dec 19, 2025": ["9:00 AM", "10:00 AM", "2:00 PM", "3:00 PM"],
  "Dec 22, 2025": ["8:00 AM", "9:00 AM", "10:00 AM", "2:00 PM", "4:00 PM"],
  "Dec 23, 2025": ["10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM"],
  "Dec 24, 2025": ["8:00 AM", "9:00 AM"],
  "Dec 26, 2025": ["9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM", "4:00 PM"],
  "Dec 29, 2025": ["8:00 AM", "9:00 AM", "10:00 AM", "2:00 PM"],
  "Dec 30, 2025": ["9:00 AM", "11:00 AM", "2:00 PM", "3:00 PM", "4:00 PM"],
  "Dec 31, 2025": ["8:00 AM", "9:00 AM", "10:00 AM"],
  "Jan 2, 2026": ["8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM", "4:00 PM"],
  "Jan 3, 2026": ["9:00 AM", "10:00 AM", "2:00 PM", "3:00 PM"],
  "Jan 6, 2026": ["8:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "4:00 PM"],
  "Jan 7, 2026": ["9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM"],
  "Jan 8, 2026": ["8:00 AM", "9:00 AM", "3:00 PM", "4:00 PM"],
  "Jan 9, 2026": ["10:00 AM", "11:00 AM", "2:00 PM"],
  "Jan 13, 2026": ["8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM", "4:00 PM"],
  "Jan 14, 2026": ["9:00 AM", "10:00 AM", "2:00 PM", "3:00 PM"],
  "Jan 15, 2026": ["8:00 AM", "11:00 AM", "2:00 PM", "4:00 PM"],
  "Jan 16, 2026": ["9:00 AM", "10:00 AM", "11:00 AM", "3:00 PM"],
  "Jan 20, 2026": ["8:00 AM", "9:00 AM", "10:00 AM", "2:00 PM", "3:00 PM", "4:00 PM"],
  "Jan 21, 2026": ["10:00 AM", "11:00 AM", "2:00 PM"],
  "Jan 22, 2026": ["8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM"],
  "Jan 23, 2026": ["9:00 AM", "2:00 PM", "3:00 PM", "4:00 PM"],
  "Jan 27, 2026": ["8:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "4:00 PM"],
  "Jan 28, 2026": ["9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM"],
  "Jan 29, 2026": ["8:00 AM", "9:00 AM", "3:00 PM", "4:00 PM"],
  "Jan 30, 2026": ["10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM"],
}

export const allTimeSlots = ["8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM", "4:00 PM"]

export const availableTimeSlots = ["8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM", "4:00 PM"]

export const appointmentCategories = [
  { id: "general", name: "General Medicine", icon: "stethoscope" },
  { id: "specialist", name: "Specialist", icon: "user-md" },
  { id: "laboratory", name: "Laboratory", icon: "flask" },
  { id: "imaging", name: "Imaging / X-Ray", icon: "x-ray" },
  { id: "dental", name: "Dental", icon: "tooth" },
  { id: "physiotherapy", name: "Physiotherapy", icon: "running" },
  { id: "vaccination", name: "Vaccination", icon: "syringe" },
]