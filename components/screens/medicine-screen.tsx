"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Pill, Clock, AlertCircle, Check, RefreshCw, Calendar, ChevronRight, Bell, ChevronLeft } from "lucide-react"

const initialMedications = [
  {
    id: 1,
    name: "Metformin 500mg",
    purpose: "Diabetes Management",
    dosage: "1 tablet",
    frequency: "Twice daily",
    times: ["8:00 AM", "8:00 PM"],
    remaining: 8,
    total: 30,
    refillDate: "Dec 20, 2025",
    takenToday: 1,
    totalToday: 2,
    reminders: true,
  },
  {
    id: 2,
    name: "Amlodipine 5mg",
    purpose: "Blood Pressure",
    dosage: "1 tablet",
    frequency: "Once daily",
    times: ["2:00 PM"],
    remaining: 15,
    total: 30,
    refillDate: "Dec 28, 2025",
    takenToday: 0,
    totalToday: 1,
    reminders: true,
  },
  {
    id: 3,
    name: "Simvastatin 20mg",
    purpose: "Cholesterol",
    dosage: "1 tablet",
    frequency: "Once daily (night)",
    times: ["10:00 PM"],
    remaining: 22,
    total: 30,
    refillDate: "Jan 5, 2026",
    takenToday: 0,
    totalToday: 1,
    reminders: false,
  },
]

export function MedicineScreen() {
  const [medications, setMedications] = useState(initialMedications)
  const [selectedMed, setSelectedMed] = useState<(typeof medications)[0] | null>(null)
  const [showReminders, setShowReminders] = useState(false)
  const [showRefillConfirm, setShowRefillConfirm] = useState(false)
  const [refillMed, setRefillMed] = useState<(typeof medications)[0] | null>(null)
  const [reminderTimes, setReminderTimes] = useState<{ [key: string]: string }>({})

  const totalTaken = medications.reduce((sum, m) => sum + m.takenToday, 0)
  const totalDoses = medications.reduce((sum, m) => sum + m.totalToday, 0)

  const handleMarkTaken = (medId: number, timeIndex: number) => {
    setMedications((prev) =>
      prev.map((med) => {
        if (med.id === medId && med.takenToday < med.totalToday) {
          return { ...med, takenToday: med.takenToday + 1 }
        }
        return med
      }),
    )
    if (selectedMed && selectedMed.id === medId) {
      setSelectedMed((prev) => (prev ? { ...prev, takenToday: prev.takenToday + 1 } : null))
    }
  }

  const handleTakeNow = (medId: number) => {
    handleMarkTaken(medId, 0)
  }

  const handleRefill = (med: (typeof medications)[0]) => {
    setRefillMed(med)
    setShowRefillConfirm(true)
  }

  const handleToggleReminders = (medId: number) => {
    setMedications((prev) => prev.map((med) => (med.id === medId ? { ...med, reminders: !med.reminders } : med)))
  }

  if (showRefillConfirm && refillMed) {
    return (
      <div className="p-4 space-y-5">
        <div className="flex flex-col items-center justify-center py-8">
          <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-4">
            <RefreshCw className="w-8 h-8 text-accent" />
          </div>
          <h1 className="text-xl font-semibold mb-2">Request Refill?</h1>
          <p className="text-sm text-muted-foreground text-center mb-6">
            You are requesting a refill for {refillMed.name}
          </p>

          <Card className="p-4 w-full mb-6">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Medication</span>
                <span className="font-medium">{refillMed.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Current Supply</span>
                <span className="font-medium">{refillMed.remaining} tablets</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Pickup Location</span>
                <span className="font-medium">HUKM Pharmacy</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Est. Ready</span>
                <span className="font-medium">2-3 working days</span>
              </div>
            </div>
          </Card>

          <div className="w-full space-y-2">
            <Button
              className="w-full"
              onClick={() => {
                setShowRefillConfirm(false)
                setRefillMed(null)
              }}
            >
              Confirm Refill Request
            </Button>
            <Button
              variant="outline"
              className="w-full bg-transparent"
              onClick={() => {
                setShowRefillConfirm(false)
                setRefillMed(null)
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (showReminders) {
    return (
      <div className="p-4 space-y-5">
        <header className="flex items-center gap-3">
          <button
            onClick={() => setShowReminders(false)}
            className="p-2 -ml-2 rounded-full hover:bg-secondary transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold">Set Reminders</h1>
        </header>

        <div className="space-y-4">
          {medications.map((med) => (
            <Card key={med.id} className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-medium">{med.name}</h3>
                  <p className="text-xs text-muted-foreground">{med.frequency}</p>
                </div>
                <Button
                  size="sm"
                  variant={med.reminders ? "default" : "outline"}
                  className={med.reminders ? "bg-accent text-accent-foreground" : "bg-transparent"}
                  onClick={() => handleToggleReminders(med.id)}
                >
                  {med.reminders ? (
                    <>
                      <Check className="w-3 h-3 mr-1" /> On
                    </>
                  ) : (
                    "Off"
                  )}
                </Button>
              </div>

              {med.reminders && (
                <div className="space-y-2">
                  {med.times.map((time, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <Input type="time" defaultValue={time.replace(" AM", "").replace(" PM", "")} className="flex-1" />
                    </div>
                  ))}
                </div>
              )}
            </Card>
          ))}
        </div>

        <Button className="w-full" onClick={() => setShowReminders(false)}>
          Save Reminders
        </Button>
      </div>
    )
  }

  if (selectedMed) {
    return (
      <div className="p-4 space-y-5">
        <header className="flex items-center gap-3">
          <button
            onClick={() => setSelectedMed(null)}
            className="p-2 -ml-2 rounded-full hover:bg-secondary transition-colors"
          >
            <ChevronRight className="w-5 h-5 rotate-180" />
          </button>
          <h1 className="text-lg font-semibold">Medicine Details</h1>
        </header>

        <Card className="p-4">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
              <Pill className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">{selectedMed.name}</h2>
              <p className="text-sm text-muted-foreground">{selectedMed.purpose}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-secondary/50 rounded-lg p-3">
              <p className="text-xs text-muted-foreground">Dosage</p>
              <p className="font-medium">{selectedMed.dosage}</p>
            </div>
            <div className="bg-secondary/50 rounded-lg p-3">
              <p className="text-xs text-muted-foreground">Frequency</p>
              <p className="font-medium">{selectedMed.frequency}</p>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Supply Remaining</span>
              <span className="text-sm font-medium">
                {selectedMed.remaining}/{selectedMed.total} tablets
              </span>
            </div>
            <Progress value={(selectedMed.remaining / selectedMed.total) * 100} className="h-2" />
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>Refill by: {selectedMed.refillDate}</span>
          </div>
        </Card>

        {/* Schedule */}
        <section>
          <h2 className="text-sm font-medium text-muted-foreground mb-3">Daily Schedule</h2>
          <div className="space-y-2">
            {selectedMed.times.map((time, index) => {
              const isTaken = index < selectedMed.takenToday
              return (
                <Card key={time} className="p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{time}</p>
                      <p className="text-xs text-muted-foreground">{selectedMed.dosage}</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant={isTaken ? "default" : "outline"}
                    className={isTaken ? "bg-accent text-accent-foreground" : "bg-transparent"}
                    onClick={() => !isTaken && handleMarkTaken(selectedMed.id, index)}
                    disabled={isTaken}
                  >
                    {isTaken ? (
                      <>
                        <Check className="w-4 h-4 mr-1" /> Taken
                      </>
                    ) : (
                      "Mark Taken"
                    )}
                  </Button>
                </Card>
              )
            })}
          </div>
        </section>

        <Button className="w-full" onClick={() => handleRefill(selectedMed)}>
          <RefreshCw className="w-4 h-4 mr-2" /> Request Refill
        </Button>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-5">
      {/* Header */}
      <header>
        <h1 className="text-lg font-semibold">Medicine</h1>
        <p className="text-sm text-muted-foreground">Track and manage your prescriptions</p>
      </header>

      {/* Today's Progress */}
      <Card className="p-4 bg-primary text-primary-foreground">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-medium">Today&apos;s Progress</h2>
          <Badge variant="secondary" className="bg-primary-foreground/20 text-primary-foreground">
            {totalTaken} of {totalDoses} taken
          </Badge>
        </div>
        <Progress value={(totalTaken / totalDoses) * 100} className="h-2 bg-primary-foreground/20" />
        <p className="text-xs text-primary-foreground/80 mt-2">
          {totalTaken < totalDoses
            ? `Next dose: ${medications.find((m) => m.takenToday < m.totalToday)?.name || ""} at ${medications.find((m) => m.takenToday < m.totalToday)?.times[0] || ""}`
            : "All doses taken for today!"}
        </p>
      </Card>

      {/* Upcoming Reminders */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-medium text-muted-foreground">Upcoming</h2>
          <Button variant="ghost" size="sm" className="text-xs h-auto py-1" onClick={() => setShowReminders(true)}>
            <Bell className="w-3 h-3 mr-1" /> Set Reminders
          </Button>
        </div>
        {medications
          .filter((m) => m.takenToday < m.totalToday)
          .slice(0, 1)
          .map((med) => (
            <Card key={med.id} className="p-3 border-primary/30 bg-primary/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{med.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {med.times[med.takenToday]} - {med.dosage}
                  </p>
                </div>
                <Button size="sm" onClick={() => handleTakeNow(med.id)}>
                  Take Now
                </Button>
              </div>
            </Card>
          ))}
      </section>

      {/* Medications List */}
      <section>
        <h2 className="text-sm font-medium text-muted-foreground mb-3">Your Medications</h2>
        <div className="space-y-3">
          {medications.map((med) => (
            <Card
              key={med.id}
              className="p-4 cursor-pointer hover:bg-secondary/50 transition-colors"
              onClick={() => setSelectedMed(med)}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    med.remaining < 10 ? "bg-destructive/10" : "bg-accent/10"
                  }`}
                >
                  <Pill className={`w-5 h-5 ${med.remaining < 10 ? "text-destructive" : "text-accent"}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">{med.name}</h3>
                      <p className="text-xs text-muted-foreground">{med.purpose}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="secondary" className="text-xs">
                      {med.takenToday}/{med.totalToday} today
                    </Badge>
                    {med.remaining < 10 && (
                      <Badge variant="destructive" className="text-xs">
                        <AlertCircle className="w-3 h-3 mr-1" /> Low supply
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {medications.some((m) => m.remaining < 10) && (
        <Card className="p-3 bg-destructive/10 border-destructive/20">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">Refill Needed</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {medications.find((m) => m.remaining < 10)?.name} is running low (
                {medications.find((m) => m.remaining < 10)?.remaining} tablets left).
              </p>
            </div>
            <Button
              size="sm"
              variant="destructive"
              className="flex-shrink-0"
              onClick={() => handleRefill(medications.find((m) => m.remaining < 10)!)}
            >
              Refill
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}
